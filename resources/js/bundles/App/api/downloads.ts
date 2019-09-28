//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import axios from '@/api/axios'
import { ISheet, ISheetDownloadOptions } from '@app/state/sheet/types' 

//-----------------------------------------------------------------------------
// Queries
//-----------------------------------------------------------------------------
export const prepareSheetDownload = async (sheetId: ISheet['id'], options: ISheetDownloadOptions) => {
	return axios.post('/app/sheets/prepare-download/' + sheetId, options).then(response => {
		return response.data
	})
}

export const downloadSheet = (sheetDownloadId: string) => {
  window.open('/app/sheets/download/' + sheetDownloadId, '_blank')
}

