//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import backgroundImage from '@site/assets/images/background.png'

import SiteFeaturesFeature from '@site/SiteFeaturesFeature'
import SiteFeaturesList from '@site/SiteFeaturesList'
import SiteFeaturesListItem from '@site/SiteFeaturesListItem'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SiteFeaturesOnboarding = () => {
  
  return (
    <>
    <SiteFeaturesFeature
      image={backgroundImage}>
      <SiteFeaturesList
        header="A format you're already familiar with...">
        <SiteFeaturesListItem>
          Tasksheet was built to be a spreadsheet at heart, so anyone familiar with Excel, Google Sheets or other spreadsheet apps can jump right in - no training required.
        </SiteFeaturesListItem>
      </SiteFeaturesList>
    </SiteFeaturesFeature>
    <SiteFeaturesFeature
      backgroundColor="rgb(240, 240, 240)"
      image="/images/background.png"
      imageFirst>
      <SiteFeaturesList
        header="...with powerful new features to make your team more efficient">
        <SiteFeaturesListItem>
          Save photos and files to cells, or take notes over time. 
          <br/><br/>
          Add dates and create Gantt charts from your sheets.
          <br/><br/>
          Save custom views for quick access later and create linked sheets to share tasks across teams.
        </SiteFeaturesListItem>
      </SiteFeaturesList>
    </SiteFeaturesFeature>
    </>
  )
}

export default SiteFeaturesOnboarding
