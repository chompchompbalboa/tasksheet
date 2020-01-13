//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import Icon from '@/components/Icon'

//-----------------------------------------------------------------------------
// Components
//-----------------------------------------------------------------------------
const ContentSidebarItem = ({
  icon,
  isActive,
  onClick,
  text,
  textFontWeight = 'normal',
  textMarginLeft = '0.625rem'
}: IContentSidebarItem) => {

  return (
    <Container
      isActive={isActive}
      onClick={onClick}>
      <IconContainer>
        <Icon 
          icon={icon} 
          size="0.85rem"/>
      </IconContainer>
      <TextContainer
        textFontWeight={textFontWeight}
        textMarginLeft={textMarginLeft}>
        {text}
      </TextContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IContentSidebarItem {
  icon?: string
  isActive: boolean
  onClick(...args: any): void
  text: string
  textFontWeight?: 'normal' | 'bold'
  textMarginLeft?: '0.625rem' | '0.3rem'
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  cursor: default;
  display: flex;
  align-items: space-between;
  width: 100%;
  white-space: nowrap;
  padding: 0.375rem 1.5rem 0.375rem 0.5rem;
  background-color: ${ ({ isActive }: IContainer ) => isActive ? 'rgb(220, 220, 220)' : 'transparent' };
  &:hover {
    background-color: rgb(220, 220, 220);
  }
`
interface IContainer {
  isActive: boolean
}

const IconContainer = styled.span`
  display: flex;
  align-items: center;
`

const TextContainer = styled.span`
  margin-left: ${ ({ textMarginLeft }: ITextContainer) => textMarginLeft };
  width: 100%;
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-size: 0.75rem;
  font-weight: ${ ({ textFontWeight }: ITextContainer) => textFontWeight };
`
interface ITextContainer {
  textFontWeight: IContentSidebarItem['textFontWeight']
  textMarginLeft: IContentSidebarItem['textMarginLeft']
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default ContentSidebarItem
