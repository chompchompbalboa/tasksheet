//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { Folder } from '@app/state/folders/types'
import { SheetColumnType } from '@app/state/sheet/types'
import { User } from '@app/state/user/types'

//-----------------------------------------------------------------------------
// Initial Data
//-----------------------------------------------------------------------------
declare global {
	const initialData: InitialData
	interface InitialData {
		user: User
    folders: Folder[]
    columnTypes: SheetColumnType[]
	}
}
export {} // Typescript needs this file to be a module
