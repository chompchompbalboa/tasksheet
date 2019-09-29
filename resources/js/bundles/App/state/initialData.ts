import { IFile, IFolder } from '@app/state/folder/types'
import { IUser, IUserActive, IUserColor } from '@app/state/user/types'

const initalData: InitialData = {
	user: <IUser>{
		id: 'uuid',
		name: '',
		email: '',
		active: <IUserActive>{
			id: 'uuid',
			tabs: [],
			tab: null,
		},
		color: <IUserColor>{
			primary: '',
			secondary: '',
		}
	},
	folders: [
		{
			id: 'uuid',
			name: 'name',
			folders: <IFolder[]>[],
			files: <IFile[]>[],
		},
  ],
  columnTypes: []
}

export default initalData
