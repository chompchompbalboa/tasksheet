//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
import { 
  IActiveSiteForm,
  IActiveSiteFormMessage 
} from '@/state/active/types'
import { 
  IActiveActions,
  UPDATE_ACTIVE_SITE_FORM,
  UPDATE_ACTIVE_SITE_FORM_MESSAGE
} from '@/state/active/actions'
//-----------------------------------------------------------------------------
// Initial
//-----------------------------------------------------------------------------
export const initialActiveState: IActiveState = {
  SITE_FORM: 'LOGIN',
  SITE_FORM_MESSAGE: 'CLICK_TO_REGISTER_INSTEAD'

}
export type IActiveState = {
  SITE_FORM: IActiveSiteForm
  SITE_FORM_MESSAGE: IActiveSiteFormMessage
}

//-----------------------------------------------------------------------------
// Reducers
//-----------------------------------------------------------------------------
export const activeReducer = (state = initialActiveState, action: IActiveActions): IActiveState => {
	switch (action.type) {

    case UPDATE_ACTIVE_SITE_FORM: {
      const { nextSiteForm } = action
      return {
        ...state,
        SITE_FORM: nextSiteForm
      }
    }

    case UPDATE_ACTIVE_SITE_FORM_MESSAGE: {
      const { nextSiteFormMessage } = action
      return {
        ...state,
        SITE_FORM_MESSAGE: nextSiteFormMessage
      }
    }

		default:
			return state
	}
}

export default activeReducer
