import { IUser, IUserActive, IUserColor } from '@app/state/user/types'
import { ITeamFromDatabase } from '@app/state/team/types'
import { IAllSheetColumnTypes } from '@app/state/sheet/types'

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
  ],
  columnTypes: <IAllSheetColumnTypes> {}
}

export default initalData
