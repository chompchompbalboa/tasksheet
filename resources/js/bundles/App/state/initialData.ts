import { File, Folder } from '@app/state/folder/types'
import { User, UserActive, UserColor, UserLayout } from '@app/state/user/types'

const initalData: InitialData = {
	user: <User>{
		id: 'uuid',
		name: '',
		email: '',
		active: <UserActive>{
			id: 'uuid',
			tabs: [],
			tabId: null,
		},
		color: <UserColor>{
			primary: '',
			secondary: '',
		},
		layout: <UserLayout>{
			id: 'uuid',
			sidebarWidth: 0.25,
		},
	},
	folders: [
		{
			id: 'uuid',
			name: 'name',
			folders: <Folder[]>[],
			files: <File[]>[],
		},
	],
}

export default initalData
