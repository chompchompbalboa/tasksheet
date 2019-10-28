import {
  IMessengerMessage,
  IMessengerMessageKey
} from '@app/state/messenger/types'

//-----------------------------------------------------------------------------
// Messages
//-----------------------------------------------------------------------------
const messages: { [ key in IMessengerMessageKey ]: IMessengerMessage } =  {
  ORGANIZATION_UPDATE_ORGANIZATION_NAME_ERROR: {
    type: 'ERROR',
    message: "Your organization's name could not be updated. Please try again."
  },
  USER_UPDATE_USER_EMAIL_ERROR: {
    type: 'ERROR',
    message: 'Your email could not be updated. Please try again.'
  },
  USER_UPDATE_USER_NAME_ERROR: {
    type: 'ERROR',
    message: 'Your name could not be updated. Please try again.'
  }
}

export default messages