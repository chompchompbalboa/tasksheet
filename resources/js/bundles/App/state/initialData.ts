import { IFile, IFolder } from '@app/state/folder/types'
import { User, UserActive, UserColor } from '@app/state/user/types'

const initalData: InitialData = {
	user: <User>{
		id: 'uuid',
		name: '',
		email: '',
		active: <UserActive>{
			id: 'uuid',
			tabs: [],
			tab: null,
		},
		color: <UserColor>{
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
