//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import axios from '@/api/axios'
import { IS3PresignedUrlData } from '@/api/vapor'

import { 
  IFile, IFileUpdates, 
  IFolder, IFolderUpdates 
} from '@app/state/folder/types'
import { 
  ISheet, ISheetUpdates,
  ISheetLinkToDatabase,
  ISheetCell, ISheetCellUpdates,
  ISheetColumn, ISheetColumnUpdates,
  ISheetFilter, 
  ISheetGroup, ISheetGroupUpdates, 
  ISheetRowToDatabase, 
  ISheetSort, ISheetSortUpdates, 
  ISheetStylesDatabaseUpdates,
  ISheetViewToDatabase, ISheetViewUpdates,
  ISheetChange,
  ISheetPriority, ISheetPriorityUpdates, ISheetCellPriority
} from '@app/state/sheet/types'
import { 
  IUser, IUserUpdates,
  IUserActiveUpdates, 
  IUserColorUpdates,
  IUserTasksheetSubscriptionUpdates
} from '@app/state/user/types'
import { 
  ITeam, ITeamMember, ITeamUpdates
} from '@app/state/team/types'

//-----------------------------------------------------------------------------
// User
//-----------------------------------------------------------------------------
export const updateUser = async (userId: IUser['id'], updates: IUserUpdates) => {
	return axios.patch('/app/user/' + userId, updates).then(response => {
		return response.data
	})
}
export const updateUserActive = async (id: string, updates: IUserActiveUpdates) => {
	return axios.patch('/app/user/active/' + id, updates).then(response => {
		return response.data
	})
}

export const updateUserColor = async (id: string, updates: IUserColorUpdates) => {
	return axios.patch('/app/user/color/' + id, updates).then(response => {
		return response.data
	})
}

export const updateUserSubscription = async (id: string, updates: IUserTasksheetSubscriptionUpdates) => {
	return axios.patch('/app/user/subscription/' + id, updates).then(response => {
		return response.data
	})
}

//-----------------------------------------------------------------------------
// Team
//-----------------------------------------------------------------------------
export const updateTeam = async (userId: ITeam['id'], updates: ITeamUpdates) => {
	return axios.patch('/app/team/' + userId, updates).then(response => {
		return response.data
	})
}

export const createTeamMember = async (teamId: ITeam['id'], newMemberEmail: string) => {
	return axios.post('/app/team/member/create', { teamId, newMemberEmail }).then(response => {
		return response.data
	})
}

export const deleteTeamMember = async (teamId: ITeam['id'], teamMemberId: ITeamMember['id']) => {
	return axios.post('/app/team/member/delete', { teamId, teamMemberId }).then(response => {
		return response.data
	})
}

//-----------------------------------------------------------------------------
// File
//-----------------------------------------------------------------------------
export const createFile = async (newFile: IFile) => {
	return axios.post('/app/files', newFile).then(response => {
		return response.data
	})
}

export const deleteFile = async (fileId: string) => {
	return axios.delete('/app/files/' + fileId).then(response => {
		return response.data
	})
}

export const restoreFile = async (fileId: string) => {
	return axios.post('/app/files/restore/' + fileId).then(response => {
		return response.data
	})
}

export const updateFile = async (id: string, updates: IFileUpdates) => {
	return axios.patch('/app/files/' + id, updates).then(response => {
		return response.data
	})
}

//-----------------------------------------------------------------------------
// Folder
//-----------------------------------------------------------------------------
export const createFolder = async (newFolder: IFolder) => {
	return axios.post('/app/folders', newFolder).then(response => {
		return response.data
	})
}

export const updateFolder = async (id: string, updates: IFolderUpdates) => {
	return axios.patch('/app/folders/' + id, updates).then(response => {
		return response.data
	})
}

export const deleteFolder = async (folderId: string) => {
	return axios.delete('/app/folders/' + folderId).then(response => {
		return response.data
	})
}

export const restoreFolder = async (folderId: string) => {
	return axios.post('/app/folders/restore/' + folderId).then(response => {
		return response.data
	})
}

//-----------------------------------------------------------------------------
// Sheet
//-----------------------------------------------------------------------------
export const createSheet = async (newSheetId: ISheet['id']) => {
	return axios.post('/app/sheets', {
    newSheetId: newSheetId,
  }).then(response => {
		return response.data
	})
}

export const createSheetFromCsv = async (newSheetId: ISheet['id'], fileToUpload: File) => {
  const formData = new FormData()
  formData.append('newSheetId', newSheetId)
  formData.append('fileToUpload', fileToUpload)
	return axios.post('/app/sheets/upload/csv', formData).then(response => {
		return response.data
	})
}

export const updateSheet = async (id: string, updates: ISheetUpdates) => {
	return axios.patch('/app/sheets/' + id, updates).then(response => {
		return response.data
	})
}

export const updateSheetCell = async (id: string, updates: ISheetCellUpdates) => {
	return axios.patch('/app/sheets/cells/' + id, updates).then(response => {
		return response.data
	})
}

export const updateSheetCells = async (updates: ISheetCellUpdates[]) => {
	return axios.patch('/app/sheets/cells/batch/update', updates).then(response => {
		return response.data
	})
}

export const createSheetCellFile = async (
  sheetId: ISheet['id'], 
  sheetCellId: ISheetCell['id'],
  filename: string,
  s3PresignedUrlData: IS3PresignedUrlData,
  uploadedAt: string
) => {
	return axios.post('/app/sheets/cells/files/upload', { sheetId, sheetCellId, filename, s3PresignedUrlData, uploadedAt }).then(response => {
		return response.data
	})
}

export const deleteSheetCellFile = async (sheetCellFileId: string) => {
	return axios.delete('/app/sheets/cells/files/' + sheetCellFileId).then(response => {
		return response.data
	})
}

export const downloadSheetCellFile = async (sheetCellFileId: string) => {
	return axios.post('/app/sheets/cells/files/download/' + sheetCellFileId)
}

export const createSheetCellPhoto = async (
  sheetId: ISheet['id'], 
  sheetCellId: ISheetCell['id'],
  filename: string,
  s3PresignedUrlData: IS3PresignedUrlData,
  uploadedAt: string
) => {
	return axios.post('/app/sheets/cells/photos/upload', { sheetId, sheetCellId, filename, s3PresignedUrlData, uploadedAt }).then(response => {
		return response.data
	})
}

export const deleteSheetCellPhoto = async (sheetCellPhotoId: string) => {
	return axios.delete('/app/sheets/cells/photos/' + sheetCellPhotoId).then(response => {
		return response.data
	})
}

export const createSheetCellChange = async (newSheetChange: ISheetChange) => {
	return axios.post('/app/sheets/cells/changes', newSheetChange).then(response => {
		return response.data
	})
}

export const deleteSheetCellChange = async (sheetCellChangeId: string) => {
	return axios.delete('/app/sheets/cells/changes/' + sheetCellChangeId).then(response => {
		return response.data
	})
}

export const createSheetColumn = async (newColumn: ISheetColumn, newCells: ISheetCell[]) => {
	return axios.post('/app/sheets/columns', {
    newColumn: newColumn,
    newCells: newCells
  }).then(response => {
		return response.data
	})
}

export const deleteSheetColumn = async (columnId: string) => {
	return axios.delete('/app/sheets/columns/' + columnId).then(response => {
		return response.data
	})
}

export const updateSheetColumn = async (id: string, updates: ISheetColumnUpdates) => {
	return axios.patch('/app/sheets/columns/' + id, updates).then(response => {
		return response.data
	})
}

export const createSheetFilter = async (filter: ISheetFilter) => {
	return axios.post('/app/sheets/filters', filter).then(response => {
		return response.data
	})
}

export const deleteSheetFilter = async (filterId: string) => {
	return axios.delete('/app/sheets/filters/' + filterId).then(response => {
		return response.data
	})
}

export const createSheetGroup = async (group: ISheetGroup) => {
	return axios.post('/app/sheets/groups', group).then(response => {
		return response.data
	})
}

export const deleteSheetGroup = async (groupId: string) => {
	return axios.delete('/app/sheets/groups/' + groupId).then(response => {
		return response.data
	})
}

export const updateSheetGroup = async (id: string, updates: ISheetGroupUpdates) => {
	return axios.patch('/app/sheets/groups/' + id, updates).then(response => {
		return response.data
	})
}

export const createSheetRows = async (newRows: ISheetRowToDatabase[]) => {
	return axios.post('/app/sheets/rows', newRows).then(response => {
		return response.data
	})
}

export const deleteSheetRow = async (rowId: string) => {
	return axios.delete('/app/sheets/rows/' + rowId).then(response => {
		return response.data
	})
}

export const deleteSheetRows = async (rowIds: string[]) => {
	return axios.post('/app/sheets/rows/batch/delete', rowIds).then(response => {
		return response.data
	})
}

export const createSheetSort = async (sort: ISheetSort) => {
	return axios.post('/app/sheets/sorts', sort).then(response => {
		return response.data
	})
}

export const deleteSheetSort = async (sortId: string) => {
	return axios.delete('/app/sheets/sorts/' + sortId).then(response => {
		return response.data
	})
}

export const updateSheetSort = async (id: string, updates: ISheetSortUpdates) => {
	return axios.patch('/app/sheets/sorts/' + id, updates).then(response => {
		return response.data
	})
}

export const updateSheetStyles = async (id: string, updates: ISheetStylesDatabaseUpdates) => {
	return axios.patch('/app/sheets/styles/' + id, updates).then(response => {
		return response.data
	})
}

export const createSheetLink = async (newSheetLink: ISheetLinkToDatabase) => {
	return axios.post('/app/sheets/links', newSheetLink).then(response => {
		return response.data
	})
}

export const createSheetView = async (newSheetView: ISheetViewToDatabase) => {
	return axios.post('/app/sheets/views', newSheetView).then(response => {
		return response.data
	})
}

export const updateSheetView = async (id: string, updates: ISheetViewUpdates) => {
	return axios.patch('/app/sheets/views/' + id, updates).then(response => {
		return response.data
	})
}

export const deleteSheetView = async (sheetViewId: string) => {
	return axios.delete('/app/sheets/views/' + sheetViewId).then(response => {
		return response.data
	})
}

export const resetSheetView = async (sheetId: string) => {
	return axios.post('/app/sheets/views/reset/' + sheetId).then(response => {
		return response.data
	})
}

export const createSheetPriority = async (priority: ISheetPriority) => {
	return axios.post('/app/sheets/priorities', priority).then(response => {
		return response.data
	})
}

export const deleteSheetPriority = async (sheetPriorityId: string) => {
	return axios.delete('/app/sheets/priorities/' + sheetPriorityId).then(response => {
		return response.data
	})
}

export const updateSheetPriority = async (id: string, updates: ISheetPriorityUpdates) => {
	return axios.patch('/app/sheets/priorities/' + id, updates).then(response => {
		return response.data
	})
}

export const createSheetCellPriorities = async (sheetCellPriorities: ISheetCellPriority[]) => {
	return axios.post('/app/sheets/cells/priorities', sheetCellPriorities).then(response => {
		return response.data
	})
}

export const deleteSheetCellPriorities = async (sheetCellPriorityIdsToDelete: ISheetCellPriority['id'][]) => {
	return axios.post('/app/sheets/cells/priorities/delete', sheetCellPriorityIdsToDelete).then(response => {
		return response.data
	})
}

