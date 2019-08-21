//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import axios from '@/api/axios'

//-----------------------------------------------------------------------------
// Queries
//-----------------------------------------------------------------------------
export const userLogin = async (email: string, password: string) => {
	return axios.post('/user/login', {
    email, password
  }).then(response => {
		return response.data
	})
}

export const userLogout = async () => {
	return axios.post('/user/logout').then(response => {
		return response.data
	})
}

export const userRegister = async (email: string, password: string, accessCode: string) => {
	return axios.post('/user/register', {
    email, password, accessCode
  }).then(response => {
		return response.data
	})
}
