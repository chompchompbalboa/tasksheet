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
        header="1. Open the registration form">
        <HelpColumns>
          <HelpColumn>
            <HelpText
              containerMarginBottom="0">
              If you haven't signed up for an account yet, please start by clicking on the link in the top right of the window.
            </HelpText>
          </HelpColumn>
          <HelpColumn>
            <HelpImage
              containerMarginBottom="0"
              containerWidth='18rem'
              src={environment.assetUrl + 'images/help/getting-started/register-link.png'}/>
          </HelpColumn>
        </HelpColumns>
      </SettingsGroup>
      <SettingsGroup
        header="2. Sign up for an account">
        <HelpColumns>
          <HelpColumn>
            <HelpText
              containerMarginBottom="0">
              This will open the form to register for an account.
              <br/><br/>
              Tasksheet is currently in an early-access beta, and new registrations require an access code. 
              <br/>
              The access code is: <b>FRIENDS_AND_FAMILY</b>
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
