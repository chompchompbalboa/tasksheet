//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { MouseEvent, PureComponent } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { IAllSheetColumns, ISheetColumn, ISheetRow } from '@/state/sheet/types'

import SheetBreakCell from '@desktop/Sheet/SheetBreakCell'
import SheetCell from '@desktop/Sheet/SheetCell'
import SheetHeaders from '@desktop/Sheet/SheetHeaders'
import SheetRowLeader from '@desktop/Sheet/SheetRowLeader'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
class SheetWindow extends PureComponent<ISheetWindowConnectedProps, ISheetWindowState> {

  container: React.RefObject<HTMLDivElement>
  scroller: React.RefObject<HTMLDivElement>
  onScrollThrottled: () => void

  ROW_HEIGHT: number = 24

	constructor(props: ISheetWindowConnectedProps) {
		super(props)
		this.container = React.createRef()
    this.scroller = React.createRef()
    this.handleResize = this.handleResize.bind(this)
		this.onScroll = this.onScroll.bind(this)
		this.onScrollThrottled = _.throttle(this.onScroll, 50)
		this.state = {
      containerWidthPx: null,
      containerHeightPx: null,
      currentStartingColumnIndex: 0,
      currentStartingRowIndex: 0,
      maxStartingColumnIndex: 0,
      maxStartingRowIndex: 0,
      numberOfColumnsToRender: 0,
      numberOfRowsToRender: 0,
      sheetWidthPx: null,
      sheetHeightPx: null
		}
  }

	componentDidMount() {
    const sheetDimensionsState = this.calculateSheetDimensionsState()
    this.setState(sheetDimensionsState)
    // Add scroll listener
    window.addEventListener('scroll', this.onScrollThrottled)
    window.addEventListener('resize', this.handleResize)
  }
  
  componentDidUpdate(previousProps: ISheetWindowConnectedProps) {
    if(previousProps.sheetVisibleRows !== this.props.sheetVisibleRows 
      || previousProps.allSheetColumns !== this.props.allSheetColumns
    ) {
      const sheetDimensionsState = this.calculateSheetDimensionsState()
      this.setState(sheetDimensionsState)
    }
  }

	componentWillUnmount() {
    window.removeEventListener('scroll', this.onScrollThrottled)
    window.addEventListener('resize', this.handleResize)
  }
  
  calculateSheetDimensionsState() {
    const {
      allSheetColumns,
      sheetViewVisibleColumns,
      sheetVisibleRows
    } = this.props

    const containerDimensions = this.container.current.getBoundingClientRect()

    const nextSheetHeightPx = sheetVisibleRows.length * this.ROW_HEIGHT
    let nextSheetWidthPx = 35 // Starts at 35 to account for the row leaders
    let numberOfColumnsToRender = 0

    sheetViewVisibleColumns.forEach((visibleColumnId, index) => {
      if(visibleColumnId !== 'COLUMN_BREAK') {
        const sheetColumn = allSheetColumns[visibleColumnId]
        const nextSheetColumn = sheetViewVisibleColumns[index + 1] ? allSheetColumns[sheetViewVisibleColumns[index + 1]] : null
        nextSheetWidthPx += sheetColumn.width
        if(nextSheetWidthPx < containerDimensions.width + (nextSheetColumn ? nextSheetColumn.width : 0) || nextSheetColumn === null) {
          numberOfColumnsToRender++
        } 
      }
      else {
        nextSheetWidthPx += 10
        numberOfColumnsToRender++
      }
    })

    const nextMaxStartingColumnIndex = sheetViewVisibleColumns.length - 1
    const nextMaxStartingRowIndex = sheetVisibleRows.length + 1

    const nextNumberOfColumnsToRender = Math.min(numberOfColumnsToRender, sheetViewVisibleColumns.length)
    const nextNumberOfRowsToRender = Math.min(Math.round(containerDimensions.height / this.ROW_HEIGHT), sheetVisibleRows.length)

    return {
      containerWidthPx: containerDimensions.width,
      containerHeightPx: containerDimensions.height,
      maxStartingColumnIndex: nextMaxStartingColumnIndex,
      maxStartingRowIndex: nextMaxStartingRowIndex,
      numberOfColumnsToRender: nextNumberOfColumnsToRender,
      numberOfRowsToRender: nextNumberOfRowsToRender,
      sheetWidthPx: nextSheetWidthPx,
      sheetHeightPx: nextSheetHeightPx
    }
  }

  handleResize() {
    const sheetDimensionsState = this.calculateSheetDimensionsState()
    this.setState(sheetDimensionsState)
  }

	onScroll() {
    const {
      sheetViewVisibleColumns,
      sheetVisibleRows
    } = this.props
    const {
      maxStartingColumnIndex,
      maxStartingRowIndex,
      sheetWidthPx,
      sheetHeightPx
    } = this.state

    // Get the next starting column index
    const nextCurrentStartingColumnIndex = this.container.current.scrollLeft === 0 ? 0 : Math.max(
      0,
      Math.min(
        maxStartingColumnIndex,
        Math.round((this.container.current.scrollLeft / (sheetWidthPx - window.innerWidth)) * sheetViewVisibleColumns.length + 1)
      )
    )

    // Get the next starting row index
    const nextCurrentStartingRowIndex = Math.max(
      0, // When scrolling up, Make sure we can't scroll beyond the first row
      Math.min(
        maxStartingRowIndex, // When scrolling down, makes sure we can't scroll beyond the last row
        Math.round((this.container.current.scrollTop / sheetHeightPx) * sheetVisibleRows.length + 1) // Calculate the current index from the scroll location of the container
      )
    )

    // Update the state
		this.setState({
      currentStartingColumnIndex: nextCurrentStartingColumnIndex,
			currentStartingRowIndex: nextCurrentStartingRowIndex === 1 ? 0 : nextCurrentStartingRowIndex
		})
  }

  render() {
    const {
      sheetId,
      allSheetColumns,
      handleContextMenu,
      sheetViewVisibleColumns,
      sheetVisibleRows,
      sheetVisibleRowLeaders
    } = this.props
    const {
      currentStartingColumnIndex,
      currentStartingRowIndex,
      numberOfColumnsToRender,
      numberOfRowsToRender,
      sheetWidthPx,
      sheetHeightPx
    } = this.state

    const columnRenderHelper = _.times(numberOfColumnsToRender, String)
    const rowRenderHelper = _.times(numberOfRowsToRender, String)

    return (
			<Container
        ref={this.container}
        onScroll={this.onScrollThrottled}>
				<ScrollContainer>
          <Scroll 
            ref={this.scroller}
            widthPx={sheetWidthPx}
            heightPx={sheetHeightPx}/>
				</ScrollContainer>
				<Sheet>
          <SheetHeaders 
            sheetId={sheetId}
            containerWidth={sheetWidthPx + 'px'}
            gridContainerRef={null}
            handleContextMenu={handleContextMenu}
            startingIndex={currentStartingColumnIndex}/>
					{rowRenderHelper.map((__, index) => {
            const sheetVisibleRowId = sheetVisibleRows[index + currentStartingRowIndex]
            const sheetVisibleRowLeaderText = sheetVisibleRowLeaders[index + currentStartingRowIndex]
            if(sheetVisibleRowId !== 'ROW_BREAK') {
              return (
                <SheetRow 
                  key={sheetVisibleRowId}
                  widthPx={sheetWidthPx}>
                  <SheetRowLeader
                    sheetId={sheetId}
                    rowId={sheetVisibleRowId}
                    handleContextMenu={handleContextMenu}
                    isRowBreak={false}
                    text={sheetVisibleRowLeaderText}
                    style={{
                      width: '35px',
                      height: this.ROW_HEIGHT + 'px'
                    }}/>
                  {columnRenderHelper.map((__, index) => {
                    const columnId = sheetViewVisibleColumns[index + currentStartingColumnIndex]
                    if(columnId && columnId !== 'COLUMN_BREAK') {
                      return (
                        <SheetCell 
                          key={columnId}
                          sheetId={sheetId}
                          columnId={columnId}
                          rowId={sheetVisibleRowId}
                          cellType={allSheetColumns[columnId].cellType}
                          style={{
                            width: allSheetColumns[columnId].width,
                            height: this.ROW_HEIGHT + 'px'
                          }}/>
                      )
                    }
                    else if (columnId) {
                      return (
                        <SheetBreakCell
                          key={'COLUMN_BREAK_' + index}
                          style={{
                            width: '10px',
                            height: this.ROW_HEIGHT + 'px'
                          }}/>
                      )
                    }
                  })}
                </SheetRow>
              )
            }
            return (
              <SheetRow 
                key={'ROW_BREAK' + index}
                widthPx={sheetWidthPx}>
                <SheetRowLeader
                  sheetId={sheetId}
                  rowId={sheetVisibleRowId}
                  isRowBreak
                  text={sheetVisibleRowLeaderText}
                  style={{
                    width: '35px',
                    height: this.ROW_HEIGHT + 'px'
                  }}/>
                {columnRenderHelper.map((__, index) => {
                  const columnId = sheetViewVisibleColumns[index + currentStartingColumnIndex]
                  if(columnId) {
                    return (
                      <SheetBreakCell
                        key={columnId === 'COLUMN_BREAK' ? columnId + index : columnId}
                        style={{
                          width: columnId === 'COLUMN_BREAK' ? '10px' : allSheetColumns[columnId].width,
                          height: this.ROW_HEIGHT + 'px'
                        }}/>
                    )
                  }
                }
                )}
              </SheetRow>
            )
          }
              
					)}
				</Sheet>
			</Container>
    )
  }
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetWindowConnectedProps extends ISheetWindowProps {
  allSheetColumns: IAllSheetColumns,
  sheetViewVisibleColumns: ISheetColumn['id'][]
  sheetVisibleRows: ISheetRow['id'][]
  sheetVisibleRowLeaders: string[]
}

interface ISheetWindowProps {
  handleContextMenu(e: MouseEvent, type: string, id: string): void
  sheetId: string
}

const mapStateToProps = (state: IAppState, ownProps: ISheetWindowProps) => {
  const sheet = state.sheet.allSheets[ownProps.sheetId]
  const sheetView = state.sheet.allSheetViews[sheet.activeSheetViewId]
  return {
    allSheetColumns: state.sheet.allSheetColumns,
    sheetViewVisibleColumns: sheetView.visibleColumns,
    sheetVisibleRows: sheet.visibleRows,
    sheetVisibleRowLeaders: sheet.visibleRowLeaders
  }
}

//-----------------------------------------------------------------------------
// State
//-----------------------------------------------------------------------------
interface ISheetWindowState {
  containerWidthPx: number
  containerHeightPx: number
  currentStartingColumnIndex: number
  currentStartingRowIndex: number
  maxStartingColumnIndex: number
  maxStartingRowIndex: number
  numberOfColumnsToRender: number
  numberOfRowsToRender: number
  sheetWidthPx: number
  sheetHeightPx: number
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: scroll;
`

const ScrollContainer = styled.div`
  z-index: 1;
  position: absolute;
  width: 100%;
  pointer-events: none;
`

const Scroll = styled.div`
width: ${( { widthPx }: IScroll ) => widthPx + 'px'};
height: ${( { heightPx }: IScroll ) => heightPx + 'px'};
`
interface IScroll {
  widthPx: number
  heightPx: number
}

const Sheet = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  min-width: 100%;
  height: 100%;
  overflow: hidden;
`

const SheetRow = styled.div`
  width: ${ ({ widthPx }: ISheetRowProps ) => widthPx + 'px' };
  display: flex;
  align-items: center;
`
interface ISheetRowProps {
  widthPx: number
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps
)(SheetWindow)
