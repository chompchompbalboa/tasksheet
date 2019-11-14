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
      image={(process.env.ASSET_PATH || '') + '/images/background.png'}>
      <SiteFeaturesList
        header="A format you're already familiar with...">
        <SiteFeaturesListItem>
          Anyone familiar with Microsoft Excel, Google Sheets or any other spreadsheet app can jump right in - no training required.
        </SiteFeaturesListItem>
      </SiteFeaturesList>
    </SiteFeaturesFeature>
    <SiteFeaturesFeature
      backgroundColor="rgb(240, 240, 240)"
      image={(process.env.ASSET_PATH || '') + '/images/background.png'}
      imageFirst>
      <SiteFeaturesList
        header="...with powerful new features to make your team more efficient">
        <SiteFeaturesListItem>
          Save photos and files to cells, or take notes over time. 
          <br/><br/>
          Add dates and create Gantt charts from your Tasksheets.
          <br/><br/>
          Filter, group and sort your tasks, and save custom views for quick access later.
        </SiteFeaturesListItem>
      </SiteFeaturesList>
    </SiteFeaturesFeature>
    </>
  )
}

export default SiteFeaturesOnboarding
