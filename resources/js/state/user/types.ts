//-----------------------------------------------------------------------------
// User
//-----------------------------------------------------------------------------
export interface IUser {
	id: string
	name: string
	email: string
	active: IUserActive
	color: IUserColor
  tasksheetSubscription: IUserTasksheetSubscription
}

export interface IUserUpdates {
  name?: string
}

export interface IUserTasksheetSubscription {
  id: string
  type: 
    'DEMO' | 
    'TRIAL' | 
    'TRIAL_EXPIRED' |
    'MONTHLY_STILL_IN_TRIAL' |
    'MONTHLY' | 
    'MONTHLY_PAST_DUE' |
    'MONTHLY_EXPIRED' |
    'MONTHLY_CANCELLED' |
    'MONTHLY_CANCELLED_STILL_IN_SUBSCRIPTION' |
    'LIFETIME'
  nextBillingDate: string
  subscriptionStartDate: string
  subscriptionEndDate: string
  trialStartDate: string
  trialEndDate: string
  stripeSetupIntentClientSecret?: string // Only set for TRIAL, TRIAL_EXPIRED, MONTHLY, and MONTHLY_EXPIRED users
}

export interface IUserTasksheetSubscriptionUpdates {
  type?: IUserTasksheetSubscription['type']
  subscriptionStartDate?: IUserTasksheetSubscription['subscriptionStartDate']
  subscriptionEndDate?: IUserTasksheetSubscription['subscriptionEndDate']
}

export type ITasksheetSubscription = 'MONTHLY' | 'LIFETIME'

export interface IUserActive {
	id: string
	tab: string
	tabs: string[]
}

export interface IUserActiveUpdates {
	tab?: string
	tabs?: string[]
}

export interface IUserColor {
	id: string
	primary: string
	secondary: string
}

export interface IUserColorUpdates {
	primary?: string
	secondary?: string
	tertiary?: string
}
