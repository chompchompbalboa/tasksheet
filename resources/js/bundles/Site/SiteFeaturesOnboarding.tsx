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
      image={simplesheet.assetUrl + 'images/background.png'}>
      <SiteFeaturesList
        header="A format you're already familiar with...">
        <SiteFeaturesListItem>
          Anyone familiar with Microsoft Excel, Google Sheets or any other spreadsheet app can jump right in to using Tasksheet - no training required.
        </SiteFeaturesListItem>
      </SiteFeaturesList>
    </SiteFeaturesFeature>
    <SiteFeaturesFeature
      backgroundColor="rgb(240, 240, 240)"
      image={simplesheet.assetUrl + 'images/background.png'}
      imageFirst>
      <SiteFeaturesList
        header="...with powerful new features that make managing your teams a breeze">
        <SiteFeaturesListItem>
          Save photos and files. Take notes and track changes to your sheet over time. Add dates and create Gantt charts. Save custom views for quick access later. And much, much more.
          <br/><br/>
          We've built Tasksheet and its features with the specific purpose of saving you time and money.
        </SiteFeaturesListItem>
      </SiteFeaturesList>
    </SiteFeaturesFeature>
    </>
  )
}

export default SiteFeaturesOnboarding
