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
      image="/images/background.png">
      <SiteFeaturesList
        header="A format you're already familiar with...">
        <SiteFeaturesListItem>
          If your team is familiar with spreadsheets, they'll feel right at home in Tasksheet. 97% of users report feeling "very comfortable" using the app within 1 week.
        </SiteFeaturesListItem>
      </SiteFeaturesList>
    </SiteFeaturesFeature>
    <SiteFeaturesFeature
      backgroundColor="rgb(240, 240, 240)"
      image="/images/background.png"
      imageFirst>
      <SiteFeaturesList
        header="...with powerful new features that make your team more efficient">
        <SiteFeaturesListItem>
          Save photos and files to cells in your spreadsheet, take notes and review the changes in your spreadsheet over time. Add dates and Gantt charts to view your workload over time. Or build your own custom cells so you can see exactly what you need to see, exactly how you need to see it.
        </SiteFeaturesListItem>
      </SiteFeaturesList>
    </SiteFeaturesFeature>
    </>
  )
}

export default SiteFeaturesOnboarding
