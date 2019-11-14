//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

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
      image='/images/background.png'>
      <SiteFeaturesList
        header="A format you're already familiar with...">
        <SiteFeaturesListItem>
          Anyone familiar with Microsoft Excel, Google Sheets or any other spreadsheet app can jump right in - no training required.
        </SiteFeaturesListItem>
      </SiteFeaturesList>
    </SiteFeaturesFeature>
    <SiteFeaturesFeature
      backgroundColor="rgb(240, 240, 240)"
      image='/images/background.png'
      imageFirst>
      <SiteFeaturesList
        header="...with powerful new features to make your team more efficient">
        <SiteFeaturesListItem>
          Save photos and files to cells. Take notes inside of cells. Add dates and create Gantt charts from your Tasksheets. Save custom views for quick access later. And much, much more.
          <br/><br/>
          We've built Tasksheet and its features with the specific purpose of saving you time and money.
        </SiteFeaturesListItem>
      </SiteFeaturesList>
    </SiteFeaturesFeature>
    </>
  )
}

export default SiteFeaturesOnboarding
