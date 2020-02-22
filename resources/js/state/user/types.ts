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
  stripeSubscription: IUserStripeSubscription
}

export interface IUserUpdates {
  name?: string
}

export interface IUserTasksheetSubscription {
  id: string
  type: 'DEMO' | 'TRIAL' | 'MONTHLY' | 'LIFETIME'
  endDate: string
  startDate: string
  stripeSetupIntentClientSecret?: string // Only set for TRIAL users
}

export interface IUserTasksheetSubscriptionUpdates {
  type?: 'DEMO' | 'TRIAL' | 'MONTHLY' | 'LIFETIME'
  startDate?: string
  endDate?: string
}

export interface IUserStripeSubscription {
  stripeStatus: 'trialing' | 'active' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'canceled' | 'unpaid'
  trialEndsAt: string
  endsAt: string
}

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
