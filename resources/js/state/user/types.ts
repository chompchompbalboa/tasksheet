//-----------------------------------------------------------------------------
// User
//-----------------------------------------------------------------------------
export interface IUser {
	id: string
	name: string
	email: string
	active: IUserActive
	color: IUserColor
  todosheetSubscription: IUserTodosheetSubscription
  stripeSubscription: IUserStripeSubscription
}

export interface IUserUpdates {
  name?: string
  email?: string
}

export interface IUserTodosheetSubscription {
  id: string
  type: 'DEMO' | 'TRIAL' | 'MONTHLY' | 'LIFETIME'
  endDate: string
  startDate: string
  stripeSetupIntentClientSecret?: string // Only set for TRIAL users
}

export interface IUserTodosheetSubscriptionUpdates {
  type?: 'DEMO' | 'TRIAL' | 'MONTHLY' | 'LIFETIME'
  startDate?: string
  endDate?: string
}

export interface IUserStripeSubscription {
  stripe_status: 'trialing' | 'active' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'canceled' | 'unpaid'
  trial_ends_at: string
  ends_at: string
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
