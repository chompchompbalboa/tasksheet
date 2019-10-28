//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IFolder } from '@app/state/folder/types'
import { IAllSheetColumnTypes } from '@app/state/sheet/types'
import { IUser } from '@app/state/user/types'
import { IOrganization } from '@app/state/organization/types'

//-----------------------------------------------------------------------------
// Initial Data
//-----------------------------------------------------------------------------
declare global {
	const initialData: IInitialData
	interface IInitialData {
    user: IUser
    organizations: IOrganization[]
    folders: IFolder[]
    columnTypes: IAllSheetColumnTypes
	}
}
export {} // Typescript needs this file to be a module
