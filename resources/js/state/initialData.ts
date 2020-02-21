import { IFolderPermission } from '@/state/folder/types'
import { 
  IUser, 
  IUserActive, 
  IUserColor, 
  IUserStripeSubscription,
  IUserTasksheetSubscription 
} from '@/state/user/types'

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
      type: 'LIFETIME',
      startDate: '2020-01-01 12:00:00',
      endDate: null,
      stripeSetupIntentClientSecret: null
    },
    stripeSubscription: <IUserStripeSubscription> {
      stripe_status: null,
      trial_ends_at: null,
      ends_at: null
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
