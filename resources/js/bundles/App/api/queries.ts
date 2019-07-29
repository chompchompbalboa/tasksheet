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

export const getSheetView = async (sheetViewId: string) => {
	return axios.get('/app/sheets/views/' + sheetViewId).then(response => {
		return response.data
	})
}
