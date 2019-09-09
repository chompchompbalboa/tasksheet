//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import axios from '@/api/axios'

//-----------------------------------------------------------------------------
// Queries
//-----------------------------------------------------------------------------
export const getSheet = async (sheetId: string) => {
	return axios.get('/app/sheets/' + sheetId).then(response => {
		return response.data
	})
}

export const getSheetCellFiles = async (sheetCellId: string) => {
	return axios.get('/app/sheets/cells/files/' + sheetCellId).then(response => {
		return response.data
	})
}

export const getSheetCellPhotos = async (sheetCellId: string) => {
	return axios.get('/app/sheets/cells/photos/' + sheetCellId).then(response => {
		return response.data
	})
}

