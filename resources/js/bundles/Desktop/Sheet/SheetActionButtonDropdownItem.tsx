//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useEffect, useRef, RefObject, forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'
import { ISheet } from '@/state/sheet/types'
import { 
  allowSelectedCellEditing,
  allowSelectedCellNavigation,
  preventSelectedCellEditing,
  preventSelectedCellNavigation
} from '@/state/sheet/actions'

import AutosizeInput from 'react-input-autosize'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SheetActionButtonDropdownItem = forwardRef(({
  sheetId,
  children,
  containerBackgroundColor = 'transparent',
  containerColor = 'inherit',
  containerHoverBackgroundColor,
  containerHoverColor = 'white',
  isFirst = false,
  isLast = false,
  isTextUpdating = false,
  onClick,
  onUpdateTextStart = () => null,
  onUpdateTextEnd = () => null,
  text,
  textPrefix = '',
  textFontStyle = 'inherit',
  textPlaceholder = 'New...',
  updateText
}: ISheetActionButtonDropdownItem, ref: RefObject<HTMLDivElement>) => {

  const dispatch = useDispatch()
  const textInput = useRef(null)
  const userColorPrimary = useSelector((state: IAppState) => state.user.color.primary)

  useEffect(() => { 
    textInput && textInput.current && textInput.current.focus()
    if(isTextUpdating) {
      addEventListener('keydown', handleKeydownWhileRenaming)
    }
    return () => {
      removeEventListener('keydown', handleKeydownWhileRenaming)
    }
  }, [ text, isTextUpdating ])

  const handleKeydownWhileRenaming = (e: KeyboardEvent) => {
    if(e.key === 'Enter') {
      textInput.current.blur()
    }
  }

  const handleTextInputBlur = () => {
    dispatch(allowSelectedCellEditing(sheetId))
    dispatch(allowSelectedCellNavigation(sheetId))
    onUpdateTextEnd()
  }

  const handleTextInputFocus = () => {
    dispatch(preventSelectedCellEditing(sheetId))
    dispatch(preventSelectedCellNavigation(sheetId))
    onUpdateTextStart()
  }

  
  return (
    <Container
      ref={ref}
      containerBackgroundColor={containerBackgroundColor}
      containerColor={containerColor}
      containerHoverBackgroundColor={containerHoverBackgroundColor || userColorPrimary}
      containerHoverColor={containerHoverColor}
      isFirst={isFirst}
      isLast={isLast}>
      {isTextUpdating 
        ? <AutosizeInput
            ref={textInput}
            className='input_placeholder_color_inherit'
            placeholder={textPlaceholder}
            value={text || ''}
            onBlur={() => handleTextInputBlur()}
            onChange={e => updateText(e.target.value)}
            onFocus={() => handleTextInputFocus()}
            inputStyle={{
              paddingRight: '1.25rem',
              minWidth: '3rem',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'inherit',
              outline: 'none',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              fontWeight: 'inherit'
            }}/>
        : <Text
            onClick={onClick}
            textFontStyle={textFontStyle}>
            {textPrefix + text}
          </Text>
      }
      <Actions>
        {children}
      </Actions>
    </Container>
  )
})

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface ISheetActionButtonDropdownItem {
  sheetId: ISheet['id']
  containerBackgroundColor?: string
  containerColor?: string
  containerHoverBackgroundColor?: string
  containerHoverColor?: string
  children?: any
  isFirst?: boolean
  isLast?: boolean
  isTextUpdating?: boolean
  onClick?(...args: any): void
  onUpdateTextEnd?(...args: any): void
  onUpdateTextStart?(...args: any): void
  text: string
  textFontStyle?: string
  textPlaceholder?: string
  textPrefix?: string
  updateText?(nextText: string): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  padding: 0.25rem 0.375rem 0.25rem 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: inherit;
  color: inherit;
  background-color: ${ ({ containerBackgroundColor }: IContainer ) =>  containerBackgroundColor };
  color: ${ ({ containerColor }: IContainer ) =>  containerColor };
  border-top-left-radius: ${ ({ isFirst }: IContainer ) =>  isFirst ? '3px' : '0' };
  border-top-right-radius: ${ ({ isFirst }: IContainer ) =>  isFirst ? '3px' : '0' };
  border-bottom-left-radius: ${ ({ isLast }: IContainer ) =>  isLast ? '3px' : '0' };
  border-bottom-right-radius: ${ ({ isLast }: IContainer ) =>  isLast ? '3px' : '0' };
  &:hover {
    background-color: ${ ({ containerHoverBackgroundColor }: IContainer ) =>  containerHoverBackgroundColor };
    color: ${ ({ containerHoverColor }: IContainer ) =>  containerHoverColor };
  }
`
interface IContainer {
  containerBackgroundColor: string
  containerColor: string
  containerHoverBackgroundColor: string
  containerHoverColor: string
  isFirst: boolean
  isLast: boolean
}


const Text = styled.div`
  width: 100%;
  padding-right: 1.25rem;
  font-style: ${ ({ textFontStyle }: IText ) => textFontStyle };
`
interface IText {
  textFontStyle: string
}

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SheetActionButtonDropdownItem
