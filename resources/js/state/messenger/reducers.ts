//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import { 
  IMessengerActions,
  CREATE_MESSENGER_MESSAGE,
  DELETE_MESSENGER_MESSAGE
} from '@/state/messenger/actions'
import { IMessengerMessage } from '@/state/messenger/types'
//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
export const initialMessengerState: IMessengerState = {
  messages: []
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
