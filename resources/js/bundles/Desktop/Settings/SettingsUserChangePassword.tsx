//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React, { FormEvent, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { mutation } from '@/api'

import { IAppState } from '@/state'

import SettingsLabelledInput from '@desktop/Settings/SettingsLabelledInput'
import SettingsSubmitButton from '@desktop/Settings/SettingsSubmitButton'

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
const SettingsUserChangePassword = () => {
  
  // Redux
  const userId = useSelector((state: IAppState) => state.user.id)

  // State
  const [ currentPasswordValue, setCurrentPasswordValue ] = useState('')
  const [ newPasswordValue, setNewPasswordValue ] = useState('')
  const [ confirmNewPasswordValue, setConfirmNewPasswordValue ] = useState('')
  const [ newPasswordSaveStatus, setNewPasswordSaveStatus ] = useState('READY' as INewPasswordSaveStatus)

  // Update User Password
  const updateUserPassword = (e: FormEvent) => {
    e.preventDefault()
    setNewPasswordSaveStatus('SAVING')
    if(!currentPasswordValue || !newPasswordValue || !confirmNewPasswordValue) {
      setTimeout(() => {
        setNewPasswordSaveStatus('SOME_FIELDS_ARE_EMPTY')
      }, 500)
    }
    else if(currentPasswordValue === newPasswordValue) {
      setTimeout(() => {
        setNewPasswordSaveStatus('NEW_PASSWORD_IS_SAME_AS_CURRENT_PASSWORD')
      }, 500)
    }
    else if(newPasswordValue !== confirmNewPasswordValue) {
      setTimeout(() => {
        setNewPasswordSaveStatus('NEW_PASSWORDS_DONT_MATCH')
      }, 500)
    }
    else {
      mutation.updateUserPassword(userId, currentPasswordValue, newPasswordValue)
        .then(() => {
          setTimeout(() => {
            (document.activeElement as HTMLElement).blur()
            setNewPasswordSaveStatus('SAVED')
            setCurrentPasswordValue('')
            setNewPasswordValue('')
            setConfirmNewPasswordValue('')
          }, 500)
          setTimeout(() => {
            setNewPasswordSaveStatus('READY')
          }, 2500)
        })
        .catch(error => {
          if(error.response.status === 400) { // Incorrect password
            setTimeout(() => {
              setNewPasswordSaveStatus('CURRENT_PASSWORD_INCORRECT')
              setCurrentPasswordValue('')
            }, 500)
          }
          else { // Generic Error
            setTimeout(() => {
              setNewPasswordSaveStatus('ERROR')
            }, 500)
          }
        })
     }
  }

  return (
    <form onSubmit={updateUserPassword}>
      <SettingsLabelledInput
        inputType="password"
        label="Enter Current Password:"
        onChange={nextValue => setCurrentPasswordValue(nextValue)}
        value={currentPasswordValue}
        width="30%"/>
      <SettingsLabelledInput
        inputType="password"
        label="Enter New Password:"
        onChange={nextValue => setNewPasswordValue(nextValue)}
        value={newPasswordValue}
        width="30%"/>
      <SettingsLabelledInput
        inputType="password"
        label="Confirm New Password:"
        onChange={nextValue => setConfirmNewPasswordValue(nextValue)}
        value={confirmNewPasswordValue}
        width="30%"/>
      <SubmitContainer>
        <ErrorMessageContainer
          data-testid="SettingsUserChangePasswordErrorMessageContainer">
          {errorMessages[newPasswordSaveStatus]}
        </ErrorMessageContainer>
        <SubmitButtonContainer>
          <SettingsSubmitButton
            testId="SettingsUserChangePasswordSubmitButton"
            text={submitButtonMessages[newPasswordSaveStatus]}/>
        </SubmitButtonContainer>
      </SubmitContainer>
    </form>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
type INewPasswordSaveStatus = 
  'READY' | 
  'SAVING' | 
  'SAVED' |
  'SOME_FIELDS_ARE_EMPTY' | 
  'NEW_PASSWORDS_DONT_MATCH' |
  'NEW_PASSWORD_IS_SAME_AS_CURRENT_PASSWORD' |
  'CURRENT_PASSWORD_INCORRECT' |
  'ERROR'

//-----------------------------------------------------------------------------
// Messages
//-----------------------------------------------------------------------------
export const submitButtonMessages = {
  READY: "Change Password",
  SAVING: "Saving...",
  SAVED: "Saved!",
  SOME_FIELDS_ARE_EMPTY: "Change Password",
  NEW_PASSWORDS_DONT_MATCH: "Change Password",
  CURRENT_PASSWORD_INCORRECT: "Change Password",
  NEW_PASSWORD_IS_SAME_AS_CURRENT_PASSWORD: "Change Password",
  ERROR: "Change Password"
}

export const errorMessages = {
  READY: "",
  SAVING: "",
  SAVED: "",
  SOME_FIELDS_ARE_EMPTY: "You haven't completed all the fields",
  NEW_PASSWORDS_DONT_MATCH: "Your passwords do not match",
  CURRENT_PASSWORD_INCORRECT: "Your current password is incorrect",
  NEW_PASSWORD_IS_SAME_AS_CURRENT_PASSWORD: "Your new password is the same as your current password",
  ERROR: "There was a problem changing your password. Please try again."
}

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const SubmitContainer = styled.div`
  width: 30%;
  display: flex;
  justify-content: space-between;
`

const ErrorMessageContainer = styled.div`
  color: rgb(200, 0, 0);
  padding-right: 0.5rem;
`

const SubmitButtonContainer = styled.div`
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SettingsUserChangePassword


