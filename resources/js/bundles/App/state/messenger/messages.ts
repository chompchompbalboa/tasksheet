import {
  IMessengerMessage,
  IMessengerMessageKey
} from '@app/state/messenger/types'

//-----------------------------------------------------------------------------
// Messages
//-----------------------------------------------------------------------------
const messages: { [ key in IMessengerMessageKey ]: IMessengerMessage } =  {
  USER_UPDATE_USER_EMAIL_ERROR: {
    type: 'ERROR',
    message: 'Your email could not be updated. Please try again.'
  },
  USER_UPDATE_USER_EMAIL_SUCCESS: {
    type: 'SUCCESS',
    message: 'Your email was successfully updated.'
  },
  USER_UPDATE_USER_NAME_ERROR: {
    type: 'ERROR',
    message: 'Your name could not be updated. Please try again.'
  },
  USER_UPDATE_USER_NAME_SUCCESS: {
    type: 'SUCCESS',
    message: 'Your name was successfully updated.'
  }
}

export default messages