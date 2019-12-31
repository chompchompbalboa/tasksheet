//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IFolder } from '@/state/folder/types'
import { IAllSheetColumnTypes } from '@/state/sheet/types'
import { IUser } from '@/state/user/types'
import { ITeamFromDatabase } from '@/state/team/types'

//-----------------------------------------------------------------------------
// Initial Data
//-----------------------------------------------------------------------------
declare global {
	const initialData: IInitialData
	interface IInitialData {
    user: IUser
    teams: ITeamFromDatabase[]
    folders: IFolder[]
	}
}
export {} // Typescript needs this file to be a module
