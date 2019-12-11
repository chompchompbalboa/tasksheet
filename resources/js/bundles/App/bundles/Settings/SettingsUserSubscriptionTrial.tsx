//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { IAppState } from '@app/state'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsUserSubscriptionTrial = () => {
  
  const userSubscriptionEndDate = useSelector((state: IAppState) => state.user.subscription.endDate)
  
  return (
    <Container>
      <ExpirationDate>
        Your 30-day free trial expires on <b>{moment(userSubscriptionEndDate).format('MMMM Do, YYYY')}.</b>
      </ExpirationDate>
      <SubscriptionTypesContainer>
        <SubscriptionType>
          <SubscriptionTypeHeader>
            Monthly
          </SubscriptionTypeHeader>
          <SubscriptionTypePrice>
            $5
          </SubscriptionTypePrice>
        </SubscriptionType>
        <SubscriptionType>
          <SubscriptionTypeHeader>
            Lifetime
          </SubscriptionTypeHeader>
          <SubscriptionTypePrice>
            $100
          </SubscriptionTypePrice>
        </SubscriptionType>
      </SubscriptionTypesContainer>
    </Container>
  )
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const Container = styled.div``

const ExpirationDate = styled.div``

const SubscriptionTypesContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`

const SubscriptionType = styled.div`
  margin-right: 0.5rem;
  padding: 0.25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  border: 1px solid rgb(220, 220, 220);
`

const SubscriptionTypeHeader = styled.div``

const SubscriptionTypePrice = styled.div`
  font-weight: bold;
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SettingsUserSubscriptionTrial
