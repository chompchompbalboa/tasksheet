//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import axios from '@/api/axios'
import { ISheet, SheetDownloadOptions } from '@app/state/sheet/types' 

//-----------------------------------------------------------------------------
// Queries
//-----------------------------------------------------------------------------
export const prepareSheetDownload = async (sheetId: ISheet['id'], options: SheetDownloadOptions) => {
	return axios.post('/app/sheets/prepare-download/' + sheetId, options).then(response => {
		return response.data
	})
}

export const downloadSheet = (sheetDownloadId: string) => {
  window.open('/app/sheets/download/' + sheetDownloadId, '_blank')
}

