//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IFolder } from '@app/state/folders/types'
import { ISheetColumnType } from '@app/state/sheet/types'
import { IUser } from '@app/state/user/types'

//-----------------------------------------------------------------------------
// Initial Data
//-----------------------------------------------------------------------------
declare global {
	const initialData: IInitialData
	interface IInitialData {
		user: IUser
    folders: IFolder[]
    columnTypes: ISheetColumnType[]
	}
}
export {} // Typescript needs this file to be a module
