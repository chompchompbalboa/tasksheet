//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import styled from 'styled-components'

import SiteFeaturesFeature from '@desktop/Site/SiteFeaturesFeature'
import SiteFeaturesList from '@desktop/Site/SiteFeaturesList'
import SiteFeaturesListItem from '@desktop/Site/SiteFeaturesListItem'
import SiteFeaturesActionButton from '@desktop/Site/SiteFeaturesActionButton'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SiteFeatures = ({
  setIsLoginOrRegister
}: ISiteFeatures) => {
  
  const handleActionButtonClick = () => {
    setIsLoginOrRegister('REGISTER')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  return (
    <Container>
      <SiteFeaturesFeature
        image={environment.assetUrl + 'images/background.png'}>
        <SiteFeaturesList
          header="A familiar format with a simple twist">
          <SiteFeaturesListItem>
            Sortsheet is a spreadsheet at heart.
            <br/><br/>
            But we stripped it down to essential features only and made powerful sorting, grouping and filtering capabilities its core feature.
          </SiteFeaturesListItem>
          <SiteFeaturesListItem>
            <SiteFeaturesActionButton
              onClick={() => handleActionButtonClick()}/>
          </SiteFeaturesListItem>
        </SiteFeaturesList>
      </SiteFeaturesFeature>
      <SiteFeaturesFeature
        backgroundColor="rgb(240, 240, 240)"
        image={environment.assetUrl + 'images/background.png'}
        imageFirst>
        <SiteFeaturesList
          header="With a modern twist">
          <SiteFeaturesListItem>
            Save photos and files. Take notes and track changes to your sheet over time. Create Gantt charts. Save custom views for quick access later. And much, much more.
            <br/><br/>
            We've built Sortsheet and its features to be quick and easy to use.
          </SiteFeaturesListItem>
          <SiteFeaturesListItem>
            <SiteFeaturesActionButton
              onClick={() => handleActionButtonClick()}
              text="Check it out"/>
          </SiteFeaturesListItem>
        </SiteFeaturesList>
      </SiteFeaturesFeature>
      <SiteFeaturesFeature
        image={environment.assetUrl + 'images/background.png'}>
        <SiteFeaturesList
          header="See exactly what you need">
          <SiteFeaturesListItem>
            With the ability to save custom views for quick access, you can see the exact level of detail you need for every situation.
          </SiteFeaturesListItem>
          <SiteFeaturesListItem>
            <SiteFeaturesActionButton
              onClick={() => handleActionButtonClick()}
              text="Sign up now"/>
          </SiteFeaturesListItem>
        </SiteFeaturesList>
      </SiteFeaturesFeature>
      <SiteFeaturesFeature
        backgroundColor="rgb(240, 240, 240)"
        image={environment.assetUrl + 'images/background.png'}
        imageFirst>
        <SiteFeaturesList
          header="Endlessly customizable">
          <SiteFeaturesListItem>
            An exhaustive library of cell types power Sortsheet and with powerful customization options built into all of them, Sortsheet can be molded to fit any workflow.
          </SiteFeaturesListItem>
          <SiteFeaturesListItem>
            <SiteFeaturesActionButton
              onClick={() => handleActionButtonClick()}
              text="Give it a shot"/>
          </SiteFeaturesListItem>
        </SiteFeaturesList>
      </SiteFeaturesFeature>
      <SiteFeaturesFeature
        image={environment.assetUrl + 'images/background.png'}>
        <SiteFeaturesList
          header="It's just useful">
          <SiteFeaturesListItem>
            We built Sortsheet to make your life easier and we're excited to see how you put it to use! We've seen it used to manage inventory, track files through approval processes, review analytics and much, much more.
          </SiteFeaturesListItem>
          <SiteFeaturesListItem>
            <SiteFeaturesActionButton
              onClick={() => handleActionButtonClick()}
              text="Let's explore"/>
          </SiteFeaturesListItem>
        </SiteFeaturesList>
      </SiteFeaturesFeature>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export interface ISiteFeatures {
  setIsLoginOrRegister(nextLoginOrRegister: 'LOGIN' | 'REGISTER'): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div``

export default SiteFeatures
