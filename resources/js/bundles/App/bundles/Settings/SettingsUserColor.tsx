//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import changeCase from 'change-case'

import { AppState } from '@app/state'
import { UserColor } from '@app/state/user/types'
import { selectUserColors } from '@app/state/user/selectors'
import { 
  updateUserColor as updateUserColorAction, UserColorUpdates
} from '@app/state/user/actions'

import SettingsTile from './SettingsTile'
import SettingsUserColorColor from './SettingsUserColorColor'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: AppState) => ({
  userColors: selectUserColors(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  // @ts-ignore thunk-action
  updateUserColor: (updates: UserColorUpdates) => dispatch(updateUserColorAction(updates))
})

//-----------------------------------------------------------------------------
// Component
//-----------------------------------------------------------------------------
export const SettingsUserColor = ({
  updateUserColor,
  userColors
}: SettingsUserColorProps) => {
  const colorKeys = Object.keys(userColors).filter(colorKey => colorKey !== "id")
  return (
    <SettingsTile
      header="Colors">
      {colorKeys.map((key: keyof UserColor) => (
        <SettingsUserColorColor
          key={key}
          label={changeCase.titleCase(key)}
          color={userColors[key]}
          onColorChange={(nextColor: string) => updateUserColor({ [key]: nextColor })}/>
      ))}
    </SettingsTile>
  )
}

//-----------------------------------------------------------------------------
// Props
//-----------------------------------------------------------------------------
export type SettingsUserColorProps = {
  updateUserColor(updates: UserColorUpdates): void
  userColors: UserColor
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsUserColor)
