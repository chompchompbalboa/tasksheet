import { IUser, IUserActive, IUserColor } from '@app/state/user/types'
import { IAllSheetColumnTypes } from './sheet/types'

const initalData: IInitialData = {
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
			folders: <string[]>[],
			files: <string[]>[],
		},
  ],
  columnTypes: <IAllSheetColumnTypes>{}
}

export default initalData
