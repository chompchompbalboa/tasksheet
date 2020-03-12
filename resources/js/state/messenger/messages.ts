//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IMessengerMessage } from '@/state/messenger/types'

export const SUBSCRIPTION_EXPIRED_MESSAGE: IMessengerMessage = {
  type: 'ERROR',
  message: "Your subscription has expired. Please renew your subscription to enable sheet editing.",
  timeout: 60000
}

export const SUBSCRIPTION_PAST_DUE_MESSAGE: IMessengerMessage = {
  type: 'ERROR',
  message: "Your most recent payment attempt failed. Please ensure your credit card information is valid. We'll attempt to charge your card again soon.",
  timeout: 60000
}