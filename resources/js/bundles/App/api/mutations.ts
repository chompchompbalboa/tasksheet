//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import axios from '@/api/axios'

import { UserColorUpdates, UserLayoutUpdates } from '@app/state/user/actions'

//-----------------------------------------------------------------------------
// User
//-----------------------------------------------------------------------------
export const updateUserColor = async (id: string, updates: UserColorUpdates) => {
	return axios.patch('/app/user/color/' + id, updates).then(response => {
		return response.data
	})
}

export const updateUserLayout = async (id: string, updates: UserLayoutUpdates) => {
	return axios.patch('/app/user/layout/' + id, updates).then(response => {
		return response.data
	})
}
