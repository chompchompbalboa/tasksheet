import { UserActions, UPDATE_USER_LAYOUT, UserLayoutUpdates } from './types'

export function updateUserLayout(updates: UserLayoutUpdates): UserActions {
  return {
    type: UPDATE_USER_LAYOUT,
    updates: updates
  }
}
