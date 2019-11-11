//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IFolder } from '@app/state/folder/types'
import { IAllSheetColumnTypes } from '@app/state/sheet/types'
import { IUser } from '@app/state/user/types'
import { ITeamFromDatabase } from '@app/state/team/types'

//-----------------------------------------------------------------------------
// Initial Data
//-----------------------------------------------------------------------------
declare global {
	const initialData: IInitialData
	interface IInitialData {
    user: IUser
    teams: ITeamFromDatabase[]
    folders: IFolder[]
    columnTypes: IAllSheetColumnTypes
	}
}
export {} // Typescript needs this file to be a module
