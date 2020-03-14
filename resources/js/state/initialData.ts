import { IFolderPermission } from '@/state/folder/types'
import { 
  IUser, 
  IUserActive, 
  IUserColor, 
  IUserTasksheetSubscription 
} from '@/state/user/types'

const initalData: IInitialData = {
	user: <IUser> {
		id: 'userId',
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
      type: 'LIFETIME',
      billingDayOfMonth: 15,
      subscriptionStartDate: '2019-01-05 12:00:00',
      subscriptionEndDate: '2020-01-01 12:00:00',
      trialStartDate: '2020-01-01 12:00:00',
      trialEndDate: '2020-01-01 12:00:00',
      stripeSetupIntentClientSecret: null
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
