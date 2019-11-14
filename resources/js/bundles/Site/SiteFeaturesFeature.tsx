//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SiteFeaturesFeature = ({
  backgroundColor = 'white',
  color = 'black',
  children,
  image,
  imageFirst = false,
  imageWidth = '55%'
}: ISiteFeaturesFeature) => (
  <Container
    containerBackgroundColor={backgroundColor}
    containerColor={color}>
    <TextContainer
      imageWidth={imageWidth}>
      {children}
    </TextContainer>
    <ImageContainer
      imageWidth={imageWidth}
      isImageFirst={imageFirst}>
      <Image
        src={image}/>
    </ImageContainer>
  </Container>
)

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISiteFeaturesFeature {
  backgroundColor?: string
  color?: string
  children: any
  image?: string
  imageFirst?: boolean
  imageWidth?: string
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  padding: 0 2.5rem;
  background-color: ${ ({ containerBackgroundColor }: IContainer ) => containerBackgroundColor };
  color: ${ ({ containerColor }: IContainer ) => containerColor };
  display: flex;
  @media (max-width: 480px) {
    flex-direction: column;
    padding: 0 1.25rem;
  }
`
interface IContainer {
  containerBackgroundColor: string
  containerColor: string
}

const TextContainer = styled.div`
  order: 2;
  padding: 3rem;
  width: 40%;
  width: ${ ({ imageWidth }: ITextContainer ) => 'calc(100% - ' + imageWidth + ')' };
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 480px) {
    width: 100%;
    padding: 1rem;
  }
`
interface ITextContainer {
  imageWidth: string
}

const ImageContainer = styled.div`
  order: ${ ({ isImageFirst }: IImageContainer ) => isImageFirst ? '1' : '3' };
  width: ${ ({ imageWidth }: IImageContainer ) => imageWidth };
  padding: 2.5rem 1.5rem;
  @media (max-width: 480px) {
    order: 1;
    width: 100%;
    padding: 1.5rem 0.5rem;
    padding-top: 2.5rem;
  }
`
interface IImageContainer {
  imageWidth: string
  isImageFirst: boolean
}

const Image = styled.img`
  width: 100%;
  height: auto;
  border-radius: 3px;
`

export default SiteFeaturesFeature
