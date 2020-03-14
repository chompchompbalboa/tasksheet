//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { useSelector } from 'react-redux'

import {
  SUBSCRIPTION_EXPIRED_MESSAGE,
  USER_DOESNT_HAVE_PERMISSION_TO_EDIT_SHEET_MESSAGE
} from '@/state/messenger/messages'

import { IAppState } from '@/state'
import { IFilePermission } from '@/state/folder/types'
import { IMessengerMessage } from '@/state/messenger/types'
import { ISheet } from '@/state/sheet/types'

//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
export const useSheetEditingPermissions = (sheetId: ISheet['id']): IReturnValue => {
  
  // Bail out if the user doesn't have an active subscription
  const userTasksheetSubscriptionType = useSelector((state: IAppState) => state.user.tasksheetSubscription.type)
  const isUserTasksheetSubscriptionActive = !['MONTHLY_EXPIRED', 'TRIAL_EXPIRED'].includes(userTasksheetSubscriptionType)
  if(!isUserTasksheetSubscriptionActive) {
    return {
      userHasPermissionToEditSheet: false,
      userPermissionErrorMessage: SUBSCRIPTION_EXPIRED_MESSAGE
    }
  }
  
  // Bail out if the user's role for the sheet doesn't grant them editing permission
  const allFilePermissions = useSelector((state: IAppState) => state.folder.allFilePermissions)
  const allUserFilePermissionsByFileTypeId = useSelector((state: IAppState) => state.folder.allUserFilePermissionsByFileTypeId)
  const userRole = allFilePermissions[allUserFilePermissionsByFileTypeId[sheetId]].role
  const userRolesWithEditingPermission: IFilePermission['role'][] = ['OWNER', 'EDITOR']
  const doesUserRoleGrantEditingPermission = userRolesWithEditingPermission.includes(userRole)
  if(!doesUserRoleGrantEditingPermission) {
    return {
      userHasPermissionToEditSheet: false,
      userPermissionErrorMessage: USER_DOESNT_HAVE_PERMISSION_TO_EDIT_SHEET_MESSAGE
    }
  }
  
  // The checks passed and the user does have permission to edit the sheet
  return {
    userHasPermissionToEditSheet: true,
    userPermissionErrorMessage: null
  }
}

//-----------------------------------------------------------------------------
// Types
//-----------------------------------------------------------------------------
interface IReturnValue {
  userHasPermissionToEditSheet: boolean
  userPermissionErrorMessage: IMessengerMessage
}