//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import axios from '@/api/axios'

import { FileUpdates, FolderUpdates } from '@app/state/folder/actions'
import { SheetFilter, SheetSort } from '@app/state/sheet/types'
import { SheetCellUpdates } from '@app/state/sheet/actions'
import { UserActiveUpdates, UserColorUpdates, UserLayoutUpdates } from '@app/state/user/actions'

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

export const updateUserLayout = async (id: string, updates: UserLayoutUpdates) => {
	return axios.patch('/app/user/layout/' + id, updates).then(response => {
		return response.data
	})
}

//-----------------------------------------------------------------------------
// File
//-----------------------------------------------------------------------------
export const updateFile = async (id: string, updates: FileUpdates) => {
	return axios.patch('/app/file/' + id, updates).then(response => {
		return response.data
	})
}

//-----------------------------------------------------------------------------
// Folder
//-----------------------------------------------------------------------------
export const updateFolder = async (id: string, updates: FolderUpdates) => {
	return axios.patch('/app/folder/' + id, updates).then(response => {
		return response.data
	})
}

//-----------------------------------------------------------------------------
// Sheet
//-----------------------------------------------------------------------------
export const updateSheetCell = async (id: string, updates: SheetCellUpdates) => {
	return axios.patch('/app/sheets/cells/' + id, updates).then(response => {
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
