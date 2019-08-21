//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import axios from '@/api/axios'

//-----------------------------------------------------------------------------
// Queries
//-----------------------------------------------------------------------------
export const userLogin = async (email: string, password: string) => {
	return axios.post('/login', {
    email, password
  }).then(response => {
		return response.data
	})
}

export const userLogout = async () => {
	return axios.post('/logout').then(response => {
		return response.data
	})
}
