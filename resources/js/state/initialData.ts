import { IUser, IUserActive, IUserColor, IUserTasksheetSubscription } from '@/state/user/types'
import { ITeamFromDatabase } from '@/state/team/types'

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
  teams: <ITeamFromDatabase[]> [{
    id: 'team-uuid',
    name: 'Team',
    members: []
  }],
	folders: [
		{
			id: 'uuid',
			name: 'name',
			folders: <string[]>[],
			files: <string[]>[],
		},
  ]
}

export default initalData
