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
    if(newPasswordValue !== confirmNewPasswordValue) {
      setNewPasswordSaveStatus('PASSWORDS_DONT_MATCH')
    }
    else {
      setNewPasswordSaveStatus('SAVING')
      mutation.updateUserPassword(userId, currentPasswordValue, newPasswordValue)
        .then(response => {
          console.log('response')
        })
        .catch(error => {
          console.log('error')
        })
     }
  }
  
  const statusMessages = {
    READY: "Change Password",
    SAVING: "Saving...",
    PASSWORDS_DONT_MATCH: ""
  }
  
  const errorMessages = {
    READY: "",
    SAVING: "",
    PASSWORDS_DONT_MATCH: ""
  }

  return (
    <form onSubmit={updateUserPassword}>
      <SettingsLabelledInput
        inputType="password"
        label="Enter Current Password:"
        onChange={nextValue => setCurrentPasswordValue(nextValue)}
        value={currentPasswordValue}
        width="25%"/>
      <SettingsLabelledInput
        inputType="password"
        label="Enter New Password:"
        onChange={nextValue => setNewPasswordValue(nextValue)}
        value={newPasswordValue}
        width="25%"/>
      <SettingsLabelledInput
        inputType="password"
        label="Confirm New Password:"
        onChange={nextValue => setConfirmNewPasswordValue(nextValue)}
        value={confirmNewPasswordValue}
        width="25%"/>
      <SubmitContainer>
        <ErrorMessage>
          {errorMessages[newPasswordSaveStatus]}
        </ErrorMessage>
        <ButtonContainer>
          <SettingsSubmitButton
            text={statusMessages[newPasswordSaveStatus]}/>
        </ButtonContainer>
      </SubmitContainer>
    </form>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
type INewPasswordSaveStatus = 'READY' | 'SAVING' | 'PASSWORDS_DONT_MATCH'

//-----------------------------------------------------------------------------
// Styled Components
//-----------------------------------------------------------------------------
const SubmitContainer = styled.div`
  width: 25%;
  display: flex;
  justify-content: space-between;
`

const ErrorMessage = styled.div`
`

const ButtonContainer = styled.div`
`

//-----------------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------------
export default SettingsUserChangePassword


