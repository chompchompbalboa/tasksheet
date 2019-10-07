//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IFolder } from '@app/state/folder/types'
import { IAllSheetColumnTypes } from '@app/state/sheet/types'
import { IUser } from '@app/state/user/types'

//-----------------------------------------------------------------------------
// Initial Data
//-----------------------------------------------------------------------------
declare global {
	const initialData: IInitialData
	interface IInitialData {
		user: IUser
    folders: IFolder[]
    columnTypes: IAllSheetColumnTypes
	}
}
export {} // Typescript needs this file to be a module
