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

export const userRegister = async (name: string, email: string, password: string) => {
	return axios.post('/user/register', {
    name, email, password
  }).then(
    response => response
  ).catch(
    error => error.response
  )
}
