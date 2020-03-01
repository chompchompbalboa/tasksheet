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
    'MONTHLY' | 
    'MONTHLY_PAST_DUE' |
    'MONTHLY_EXPIRED' |
    'LIFETIME'
  billingDayOfMonth: number
  subscriptionStartDate: string
  subscriptionEndDate: string
  trialStartDate: string
  trialEndDate: string
  stripeSetupIntentClientSecret?: string // Only set for TRIAL, TRIAL_EXPIRED, MONTHLY, and MONTHLY_EXPIRED users
}

export interface IUserTasksheetSubscriptionUpdates {
  type?: IUserTasksheetSubscription['type']
  billingDayOfMonth?: IUserTasksheetSubscription['billingDayOfMonth']
  subscriptionStartDate?: IUserTasksheetSubscription['subscriptionStartDate']
  subscriptionEndDate?: IUserTasksheetSubscription['subscriptionEndDate']
}

export type ITasksheetSubscriptionPlan = 'MONTHLY' | 'LIFETIME'

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
