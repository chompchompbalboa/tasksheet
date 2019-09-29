//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import React from 'react'
import { connect } from 'react-redux'
import changeCase from 'change-case'

import { IAppState } from '@app/state'
import { ThunkDispatch } from '@app/state/types'
import { 
  IUserColor, IUserColorUpdates
} from '@app/state/user/types'
import { selectUserColors } from '@app/state/user/selectors'
import { 
  updateUserColor as updateUserColorAction
} from '@app/state/user/actions'

import SettingsTile from './SettingsTile'
import SettingsUserColorColor from './SettingsUserColorColor'

//-----------------------------------------------------------------------------
// Redux
//-----------------------------------------------------------------------------
const mapStateToProps = (state: IAppState) => ({
  userColors: selectUserColors(state)
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  updateUserColor: (updates: IUserColorUpdates) => dispatch(updateUserColorAction(updates))
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
      {colorKeys.map((key: keyof IUserColor) => (
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
  updateUserColor(updates: IUserColorUpdates): void
  userColors: IUserColor
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsUserColor)
