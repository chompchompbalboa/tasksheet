//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import { 
  IMessengerActions,
  CREATE_MESSENGER_MESSAGE,
  DELETE_MESSENGER_MESSAGE
} from '@/state/messenger/actions'
import { IMessengerMessageKey } from '@/state/messenger/types'
//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
export const initialMessengerState: IMessengerState = {
  messages: []
}
export type IMessengerState = {
  messages: IMessengerMessageKey[]
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
      const { messageToDelete } = action
      return {
        messages: state.messages.filter(message => message !== messageToDelete)
      }
    }

		default:
			return state
	}
}

export default userReducer
