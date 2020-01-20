//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IFolder } from '@/state/folder/types'
import { IAllSheetColumnTypes } from '@/state/sheet/types'
import { IUser } from '@/state/user/types'

//-----------------------------------------------------------------------------
// Initial Data
//-----------------------------------------------------------------------------
declare global {
	const initialData: IInitialData
	interface IInitialData {
    user: IUser
    folders: IFolder[]
	}
}
export {} // Typescript needs this file to be a module
