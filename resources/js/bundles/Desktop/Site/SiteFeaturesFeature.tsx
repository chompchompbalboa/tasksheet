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
  imageWidth = '50%'
}: ISiteFeaturesFeature) => (
  <Container
    containerBackgroundColor={backgroundColor}
    containerColor={color}>
    <TextContainer
      imageWidth={imageWidth}>
      {children}
    </TextContainer>
    <Laptop
      imageWidth={imageWidth}
      isImageFirst={imageFirst}>
      <LaptopScreen>
        <Image
          src={image}/>
      </LaptopScreen>
    </Laptop>
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
  padding: 2.5rem;
  background-color: ${ ({ containerBackgroundColor }: IContainer ) => containerBackgroundColor };
  color: ${ ({ containerColor }: IContainer ) => containerColor };
  display: flex;
  @media (max-width: 480px) {
    flex-direction: column;
    padding:  1.25rem;
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

const Laptop = styled.div`
  order: ${ ({ isImageFirst }: ILaptop ) => isImageFirst ? '1' : '3' };
  width: ${ ({ imageWidth }: ILaptop ) => imageWidth };
  display: flex;
  justify-content: center;
  align-items: center;
`
interface ILaptop {
  imageWidth: string
  isImageFirst: boolean
}

const LaptopScreen = styled.div`
  border: 2.5rem solid rgb(195, 195, 195);
  border-radius: 1rem;
  @media (max-width: 480px) {
    width: 100%;
    padding: 1.5rem 0.5rem;
    padding-top: 2.5rem;
  }
`

const Image = styled.img`
  width: 100%;
  height: auto;
  border-radius: 3px;
`

export default SiteFeaturesFeature
