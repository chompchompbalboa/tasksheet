import { IFolderUser } from '@/state/folder/types'
import { IUser, IUserActive, IUserColor, IUserTasksheetSubscription } from '@/state/user/types'
const initalData: IInitialData = {
	user: <IUser> {
		id: 'uuid',
		name: '',
		email: '',
		active: <IUserActive> {
			id: 'uuid',
			tabs: [],
			tab: null,
		},
		color: <IUserColor> {
			primary: '',
			secondary: '',
    },
    tasksheetSubscription: <IUserTasksheetSubscription> {
      id: 'userSubscriptionId',
      type: 'LIFETIME'
    }
  },
	folders: [
		{
			id: 'uuid',
			name: 'name',
			folders: <string[]>[],
			files: <string[]>[],
			users: <IFolderUser[]>[],
		},
  ]
}

export default initalData
