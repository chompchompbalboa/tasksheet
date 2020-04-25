//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IMessengerMessage } from '@/state/messenger/types'

export const SUBSCRIPTION_EXPIRED_MESSAGE: IMessengerMessage = {
  type: 'ERROR',
  message: "Your subscription is no longer active. Please renew your subscription to enable sheet editing.",
  timeout: 5000
}

export const SUBSCRIPTION_PAST_DUE_MESSAGE: IMessengerMessage = {
  type: 'ERROR',
  message: "Your most recent payment attempt failed. Please ensure your credit card information is valid. We'll attempt to charge your card again soon.",
  timeout: 60000
}

export const USER_DOESNT_HAVE_PERMISSION_TO_EDIT_SHEET_MESSAGE: IMessengerMessage = {
  type: 'ERROR',
  message: "You don't have permission to edit this sheet. Please contact the sheet owner to request editing access.",
  timeout: 5000
}

export const SHEET_PRIORITY_IS_IN_USE: IMessengerMessage = {
  type: 'ERROR',
  message: "The priority you are trying to delete is being used by a cell in this sheet. Please remove the priority from the cell and try again.",
  timeout: 5000
}