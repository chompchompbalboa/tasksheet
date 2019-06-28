//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import axios from '@/api/axios'

import { UserLayoutUpdates } from '@app/state/user/actions'

//-----------------------------------------------------------------------------
// User
//-----------------------------------------------------------------------------
export const updateUserLayout = async (id: string, updates: UserLayoutUpdates) => {
	return axios.patch('/app/user/layout/' + id, updates).then(response => {
		return response.data
	})
}
