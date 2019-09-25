//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import axios from '@/api/axios'
import { Sheet, SheetDownloadOptions } from '@app/state/sheet/types' 

//-----------------------------------------------------------------------------
// Queries
//-----------------------------------------------------------------------------
export const downloadSheet = async (sheetId: Sheet['id'], options: SheetDownloadOptions) => {
	return axios.post('/app/sheets/download/' + sheetId, options).then(response => {
		return response.data
	})
}

