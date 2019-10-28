import { IUser, IUserActive, IUserColor } from '@app/state/user/types'
import { IOrganization } from '@app/state/organizations/types'
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
  organizations: <IOrganization[]> [{
    id: 'organization-uuid',
    name: 'Organization',
    users: []
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
