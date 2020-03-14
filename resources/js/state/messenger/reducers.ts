//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import defaultInitialData from '@/state/initialData'
import { 
  IMessengerActions,
  CREATE_MESSENGER_MESSAGE,
  DELETE_MESSENGER_MESSAGE
} from '@/state/messenger/actions'
import { IMessengerMessage } from '@/state/messenger/types'
import { IUser } from '@/state/user/types'

import {
  SUBSCRIPTION_EXPIRED_MESSAGE,
  SUBSCRIPTION_PAST_DUE_MESSAGE
} from '@/state/messenger/messages'

//-----------------------------------------------------------------------------
// Initial State
//-----------------------------------------------------------------------------
const getInitialMessages = () => {
  const initialUserState: IUser = typeof initialData !== 'undefined' ? initialData.user : defaultInitialData.user
  const userTasksheetSubscriptionType = initialUserState.tasksheetSubscription.type
  if(['TRIAL_EXPIRED', 'MONTHLY_EXPIRED'].includes(userTasksheetSubscriptionType)) {
    return [ { ...SUBSCRIPTION_EXPIRED_MESSAGE, timeout: 60000 } ]
  }
  if(userTasksheetSubscriptionType === 'MONTHLY_PAST_DUE') {
    return [ SUBSCRIPTION_PAST_DUE_MESSAGE ]
  }
  return []
}

export const initialMessengerState: IMessengerState = {
  messages: getInitialMessages()
}

export type IMessengerState = {
  messages: IMessengerMessage[]
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const userReducer = (state = initialMessengerState, action: IMessengerActions): IMessengerState => {
	switch (action.type) {

    case CREATE_MESSENGER_MESSAGE: {
      const { newMessage } = action
      const allMessengerMessages = state.messages.map(message => message.message)
      if(!allMessengerMessages.includes(newMessage.message)) {
        return {
          messages: [ newMessage, ...state.messages ]
        }
      }
      else {
        return state
      }
    }

    case DELETE_MESSENGER_MESSAGE: {
      const { messageIndex } = action
      return {
        messages: state.messages.filter((message, index) => index !== messageIndex)
      }
    }

		default:
			return state
	}
}

export default userReducer
