//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IMessengerMessageKey } from '@/state/messenger/types'

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export type IMessengerActions = ICreateMessengerMessage | IDeleteMessengerMessage

//-----------------------------------------------------------------------------
// Create Message
//-----------------------------------------------------------------------------
export const CREATE_MESSENGER_MESSAGE = 'CREATE_MESSENGER_MESSAGE'
interface ICreateMessengerMessage {
	type: typeof CREATE_MESSENGER_MESSAGE
	newMessage: IMessengerMessageKey
}

export const createMessengerMessage = (newMessage: IMessengerMessageKey): IMessengerActions => {
	return {
		type: CREATE_MESSENGER_MESSAGE,
		newMessage
	}
}

//-----------------------------------------------------------------------------
// Delete Message
//-----------------------------------------------------------------------------
export const DELETE_MESSENGER_MESSAGE = 'DELETE_MESSENGER_MESSAGE'
interface IDeleteMessengerMessage {
	type: typeof DELETE_MESSENGER_MESSAGE
	messageToDelete: IMessengerMessageKey
}

export const deleteMessengerMessage = (messageToDelete: IMessengerMessageKey): IMessengerActions => {
	return {
		type: DELETE_MESSENGER_MESSAGE,
		messageToDelete
	}
}