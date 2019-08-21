//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import axios from '@/api/axios'

import { File as TFile, FileUpdates, Folder, FolderUpdates } from '@app/state/folder/types'
import { 
  Sheet, SheetUpdates,
  SheetCell, SheetCellUpdates,
  SheetColumn, SheetColumnUpdates,
  SheetFilter, 
  SheetGroup, SheetGroupUpdates, 
  SheetRowToServer, 
  SheetSort, SheetSortUpdates, 
  SheetView } from '@app/state/sheet/types'
import { UserActiveUpdates, UserColorUpdates} from '@app/state/user/actions'

//-----------------------------------------------------------------------------
// User
//-----------------------------------------------------------------------------
export const updateUserActive = async (id: string, updates: UserActiveUpdates) => {
	return axios.patch('/app/user/active/' + id, updates).then(response => {
		return response.data
	})
}

export const updateUserColor = async (id: string, updates: UserColorUpdates) => {
	return axios.patch('/app/user/color/' + id, updates).then(response => {
		return response.data
	})
}

//-----------------------------------------------------------------------------
// File
//-----------------------------------------------------------------------------
export const createFile = async (newFile: TFile) => {
	return axios.post('/app/files', newFile).then(response => {
		return response.data
	})
}

export const updateFile = async (id: string, updates: FileUpdates) => {
	return axios.patch('/app/files/' + id, updates).then(response => {
		return response.data
	})
}

//-----------------------------------------------------------------------------
// Folder
//-----------------------------------------------------------------------------
export const createFolder = async (newFolder: Folder) => {
	return axios.post('/app/folders', newFolder).then(response => {
		return response.data
	})
}

export const updateFolder = async (id: string, updates: FolderUpdates) => {
	return axios.patch('/app/folders/' + id, updates).then(response => {
		return response.data
	})
}

//-----------------------------------------------------------------------------
// Sheet
//-----------------------------------------------------------------------------
export const createSheet = async (newSheetId: Sheet['id']) => {
	return axios.post('/app/sheets', {
    newSheetId: newSheetId,
  }).then(response => {
		return response.data
	})
}

export const createSheetFromCsv = async (newSheetId: Sheet['id'], fileToUpload: File) => {
  const formData = new FormData()
  formData.append('newSheetId', newSheetId)
  formData.append('fileToUpload', fileToUpload)
	return axios.post('/app/sheets/upload/csv', formData).then(response => {
		return response.data
	})
}

export const updateSheet = async (id: string, updates: SheetUpdates) => {
	return axios.patch('/app/sheets/' + id, updates).then(response => {
		return response.data
	})
}

export const updateSheetCell = async (id: string, updates: SheetCellUpdates) => {
	return axios.patch('/app/sheets/cells/' + id, updates).then(response => {
		return response.data
	})
}

export const createSheetColumn = async (newColumn: SheetColumn, newCells: SheetCell[]) => {
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

export const updateSheetColumn = async (id: string, updates: SheetColumnUpdates) => {
	return axios.patch('/app/sheets/columns/' + id, updates).then(response => {
		return response.data
	})
}

export const createSheetFilter = async (filter: SheetFilter) => {
	return axios.post('/app/sheets/filters', filter).then(response => {
		return response.data
	})
}

export const deleteSheetFilter = async (filterId: string) => {
	return axios.delete('/app/sheets/filters/' + filterId).then(response => {
		return response.data
	})
}

export const createSheetGroup = async (group: SheetGroup) => {
	return axios.post('/app/sheets/groups', group).then(response => {
		return response.data
	})
}

export const deleteSheetGroup = async (groupId: string) => {
	return axios.delete('/app/sheets/groups/' + groupId).then(response => {
		return response.data
	})
}

export const updateSheetGroup = async (id: string, updates: SheetGroupUpdates) => {
	return axios.patch('/app/sheets/groups/' + id, updates).then(response => {
		return response.data
	})
}

export const createSheetRow = async (row: SheetRowToServer) => {
	return axios.post('/app/sheets/rows', row).then(response => {
		return response.data
	})
}

export const deleteSheetRow = async (rowId: string) => {
	return axios.delete('/app/sheets/rows/' + rowId).then(response => {
		return response.data
	})
}

export const createSheetSort = async (sort: SheetSort) => {
	return axios.post('/app/sheets/sorts', sort).then(response => {
		return response.data
	})
}

export const deleteSheetSort = async (sortId: string) => {
	return axios.delete('/app/sheets/sorts/' + sortId).then(response => {
		return response.data
	})
}

export const updateSheetSort = async (id: string, updates: SheetSortUpdates) => {
	return axios.patch('/app/sheets/sorts/' + id, updates).then(response => {
		return response.data
	})
}

export const createSheetView = async (newSheetView: SheetView) => {
	return axios.post('/app/sheets/views', newSheetView).then(response => {
		return response.data
	})
}
