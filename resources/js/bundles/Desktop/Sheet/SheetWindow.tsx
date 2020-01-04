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
// Constants
//-----------------------------------------------------------------------------
const windowHeight = window.innerHeight
const rowHeight = 24
const numberOfRowsToRender = windowHeight / rowHeight + 2

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
class SheetWindow extends PureComponent<ISheetWindowConnectedProps, ISheetWindowState> {

  container: React.RefObject<HTMLDivElement>
  scroller: React.RefObject<HTMLDivElement>
  onScrollThrottled: () => void

	constructor(props: ISheetWindowConnectedProps) {
		super(props)
		this.container = React.createRef()
		this.scroller = React.createRef()
		this.onScroll = this.onScroll.bind(this)
		this.onScrollThrottled = _.throttle(this.onScroll, 85)
		this.state = {
			currentTop: 0
		}
  }

	componentDidMount() {
    window.addEventListener('scroll', this.onScroll)
	}

	componentWillUnmount() {
    window.removeEventListener('scroll', this.onScrollThrottled)
	}

	onScroll() {
    const {
      sheetVisibleRows
    } = this.props
		const nextCurrentTop = Math.round(this.container.current.scrollTop / rowHeight)
    const maxCurrentTop = Math.round(sheetVisibleRows.length - numberOfRowsToRender + 2)
		this.setState({
			currentTop: Math.min(maxCurrentTop, nextCurrentTop)
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
      currentTop
    } = this.state

    return (
			<Container
        ref={this.container}
        onScroll={this.onScrollThrottled}>
				<ScrollContainer>
          <Scroll 
            ref={this.scroller}
            numberOfVisibleRows={sheetVisibleRows.length}/>
				</ScrollContainer>
				<Sheet>
          <SheetHeaders 
            sheetId={sheetId}
            gridContainerRef={null}
            handleContextMenu={handleContextMenu}/>
					{_.times(Math.min(numberOfRowsToRender, sheetVisibleRows.length), String).map((_, index) => {
            const sheetVisibleRowId = sheetVisibleRows[index + currentTop]
            const sheetVisibleRowLeaderText = sheetVisibleRowLeaders[index + currentTop]
            if(sheetVisibleRowId !== 'ROW_BREAK') {
              return (
                <SheetRow key={sheetVisibleRowId}>
                  <SheetRowLeader
                    sheetId={sheetId}
                    rowId={sheetVisibleRowId}
                    handleContextMenu={handleContextMenu}
                    isRowBreak={false}
                    text={sheetVisibleRowLeaderText}
                    style={{
                      width: '35px',
                      height: '24px'
                    }}/>
                  {sheetViewVisibleColumns.map((columnId, index) => {
                    if(columnId !== 'COLUMN_BREAK') {
                      return (
                        <SheetCell 
                          key={columnId}
                          sheetId={sheetId}
                          columnId={columnId}
                          rowId={sheetVisibleRowId}
                          cellType={allSheetColumns[columnId].cellType}
                          style={{
                            width: allSheetColumns[columnId].width,
                            height: '24px'
                          }}/>
                      )
                    }
                    return (
                      <SheetBreakCell
                        key={'COLUMN_BREAK_' + index}
                        style={{
                          width: '10px',
                          height: '24px'
                        }}/>
                    )
                  })}
                </SheetRow>
              )
            }
            return (
              <SheetRow key={'ROW_BREAK' + index}>
                <SheetRowLeader
                  sheetId={sheetId}
                  rowId={sheetVisibleRowId}
                  isRowBreak
                  text={sheetVisibleRowLeaderText}
                  style={{
                    width: '35px',
                    height: '24px'
                  }}/>
                {sheetViewVisibleColumns.map((columnId, index) => (
                  <SheetBreakCell
                    key={columnId === 'COLUMN_BREAK' ? columnId + index : columnId}
                    style={{
                      width: columnId === 'COLUMN_BREAK' ? '10px' : allSheetColumns[columnId].width,
                      height: '24px'
                    }}/>
                ))}
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
  currentTop: number
}
//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
position: absolute;
width: 100%;
height: 100%;
overflow-x: hidden;
`

const ScrollContainer = styled.div`
z-index: 1;
position: absolute;
width: 100%;
pointer-events: none;
`

const Scroll = styled.div`
width: 100%;
height: ${( { numberOfVisibleRows }: IScroll ) => numberOfVisibleRows * rowHeight + 'px'};
`
interface IScroll {
  numberOfVisibleRows: number
}

const Sheet = styled.div`
position: sticky;
top: 0;
left: 0;
width: 100%;
height: 100%;
overflow: hidden;
`

const SheetRow = styled.div`
width: 100%;
display: flex;
align-items: center;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default connect(
  mapStateToProps
)(SheetWindow)
