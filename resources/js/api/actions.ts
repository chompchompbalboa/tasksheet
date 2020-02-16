//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import axios from '@/api/axios'

import { IUser } from '@/state/user/types'

//-----------------------------------------------------------------------------
// Queries
//-----------------------------------------------------------------------------
export const userLogin = async (email: string, password: string) => {
	return axios.post('/user/login', {
    email, password
  }).then(
    response => response
  ).catch(
    error => error.response
  )
}

export const userLogout = async () => {
	return axios.post('/user/logout').then(response => {
		return response.data
	})
}

export const userRegister = async (name: string, email: string, password: string) => {
	return axios.post('/user/register', {
    name, email, password
  })
}

export const userSubscriptionPurchaseLifetime = async (userId: IUser['id'], stripePaymentMethodId: string) => {
  return axios.post('/app/user/' + userId + '/subscription/purchase/lifetime', {
    stripePaymentMethodId
  }).then(response => {
    return response
  }).catch(
    error => error.response
  )
}

export const userSubscriptionPurchaseMonthly = async (userId: IUser['id'], stripeSetupIntentPaymentMethodId: string) => {
  return axios.post('/app/user/' + userId + '/subscription/purchase/monthly', {
    stripeSetupIntentPaymentMethodId
  }).then(response => {
    return response
  }).catch(
    error => error.response
  )
}
