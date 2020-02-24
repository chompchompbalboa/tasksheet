//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@/state'

import SubscriptionType from '@desktop/Stripe/StripePurchaseSubscriptionSubscriptionType'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const StripePurchaseSubscriptionSubscriptionTypes = ({
  monthlyOrLifetime,
  setMonthlyOrLifetime
}: IStripePurchaseSubscriptionSubscriptionTypes) => {

  // Redux
  const userSubscriptionTrialEndDate = useSelector((state: IAppState) => state.user.tasksheetSubscription.trialEndDate)

  return (
    <Container>
      <Header>
        Please choose a plan: 
      </Header>
      <SubscriptionTypesContainer>
        <SubscriptionType
          description={"Your first billing will occur on " + moment(userSubscriptionTrialEndDate).format('MMMM Do, YYYY') + " and repeat every month on the " + moment(userSubscriptionTrialEndDate).format('Do')}
          header="Monthly"
          isSelected={monthlyOrLifetime === 'MONTHLY'}
          onClick={() => setMonthlyOrLifetime('MONTHLY')}
          price="$5"/>
        <SubscriptionType
          description="Billed immediately, you'll have access to Tasksheet and all of its features forever."
          header="Lifetime"
          isSelected={monthlyOrLifetime === 'LIFETIME'}
          onClick={() => setMonthlyOrLifetime('LIFETIME')}
          price="$100"/>
      </SubscriptionTypesContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
interface IStripePurchaseSubscriptionSubscriptionTypes {
  monthlyOrLifetime: 'MONTHLY' | 'LIFETIME'
  setMonthlyOrLifetime(nextMonthlyOrLifetime: 'MONTHLY' | 'LIFETIME'): void
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-right: 1rem;
`

const Header = styled.div`
  margin-bottom: 0.5rem;
`

const SubscriptionTypesContainer = styled.div`
  padding-top: 1rem;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default StripePurchaseSubscriptionSubscriptionTypes
