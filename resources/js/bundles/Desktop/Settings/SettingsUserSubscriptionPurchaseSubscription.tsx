//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { useState } from 'react'
import styled from 'styled-components'

import SettingsUserSubscriptionPurchaseSubscriptionStripe from '@desktop/Settings/SettingsUserSubscriptionPurchaseSubscriptionStripe'
import SettingsUserSubscriptionPurchaseSubscriptionSubscriptionTypes from '@desktop/Settings/SettingsUserSubscriptionPurchaseSubscriptionSubscriptionTypes'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsUserSubscriptionPurchaseSubscription = () => {

  // State
  const [ monthlyOrLifetime, setMonthlyOrLifetime ] = useState('MONTHLY' as 'MONTHLY' | 'LIFETIME')

  return (
    <Container>
      <SettingsUserSubscriptionPurchaseSubscriptionSubscriptionTypes
        monthlyOrLifetime={monthlyOrLifetime}
        setMonthlyOrLifetime={setMonthlyOrLifetime}/>
      <SettingsUserSubscriptionPurchaseSubscriptionStripe
        monthlyOrLifetime={monthlyOrLifetime}/>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SettingsUserSubscriptionPurchaseSubscription
