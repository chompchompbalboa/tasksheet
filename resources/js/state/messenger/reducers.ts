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

//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
const initialUserState: IUser = typeof initialData !== 'undefined' ? initialData.user : defaultInitialData.user

const getInitialMessages = (): IMessengerMessage[] => {
  const userTasksheetSubscriptionType = initialUserState.tasksheetSubscription.type
  if(['TRIAL_EXPIRED', 'MONTHLY_EXPIRED'].includes(userTasksheetSubscriptionType)) {
    return [
      { 
        type: 'ERROR',
        message: 'Your subscription has expired. Please renew your subscription to enable sheet editing.',
        timeout: 60000
      }
    ]
  }
  if(userTasksheetSubscriptionType === 'MONTHLY_PAST_DUE') {
    return [
      { 
        type: 'ERROR',
        message: "Your most recent payment attempt failed. Please ensure your credit card information is valid. We'll attempt to charge your card again soon.",
        timeout: 60000
      }
    ]
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
      return {
        messages: [ newMessage, ...state.messages ]
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
