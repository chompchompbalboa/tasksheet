import { IFolderPermission } from '@/state/folder/types'
import { IUser, IUserActive, IUserColor, IUserSortsheetSubscription } from '@/state/user/types'

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
    sortsheetSubscription: <IUserSortsheetSubscription> {
      id: 'userSubscriptionId',
      type: 'LIFETIME'
    }
  },
	folders: [
		{
			id: 'uuid',
			name: 'name',
      role: 'OWNER',
			permissions: <IFolderPermission[]>[],
		},
  ],
  files: []
}

export default initalData
