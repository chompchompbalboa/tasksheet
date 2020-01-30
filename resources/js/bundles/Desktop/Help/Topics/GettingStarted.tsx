//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'

import ContentContent from '@desktop/Content/ContentContent'
import HelpColumn from '@desktop/Help/HelpColumn'
import HelpColumns from '@desktop/Help/HelpColumns'
import HelpImage from '@desktop/Help/HelpImage'
import HelpText from '@desktop/Help/HelpText'

import SettingsGroup from '@desktop/Settings/SettingsGroup'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const GettingStarted = () => {

  return (
    <ContentContent>
      <SettingsGroup
        header="Sign Up For An Account">
        <HelpColumns>
          <HelpColumn>
            <HelpText
              containerMarginBottom="0">
              <b>1)</b> If you haven't signed up for an account yet, please start by clicking on the link in the top right of the window.
            </HelpText>
          </HelpColumn>
          <HelpColumn>
            <HelpImage
              containerMarginBottom="0"
              containerWidth='18rem'
              src={environment.assetUrl + 'images/help/getting-started/register-link.png'}/>
          </HelpColumn>
        </HelpColumns>
        <HelpColumns
          containerAlignItems="flex-start">
          <HelpColumn
            containerAlignItems="flex-start">
            <HelpText
              containerMarginBottom="0">
              <b>2)</b> This will open the form to register for an account. Sortsheet is currently in an early-access beta and new registrations require an access code. The access code is <b>EARLY_ACCESS</b>
            </HelpText>
          </HelpColumn>
          <HelpColumn>
            <HelpImage
              containerMarginBottom="0"
              containerWidth='25rem'
              src={environment.assetUrl + 'images/help/getting-started/register-form-with-values.png'}/>
          </HelpColumn>
        </HelpColumns>
      </SettingsGroup>
    </ContentContent>
  )
}

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default GettingStarted
