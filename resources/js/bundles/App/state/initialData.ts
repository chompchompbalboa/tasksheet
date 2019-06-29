import { User, UserColor, UserLayout } from '@app/state/user/types'

const initalData: InitialData = {
	user: <User>{
		id: 'uuid',
		name: '',
		email: '',
		color: <UserColor>{
			primary: '',
			secondary: '',
			tertiary: '',
		},
		layout: <UserLayout>{
			id: 'uuid',
			sidebarWidth: 0.25,
		},
	},
}

export default initalData
