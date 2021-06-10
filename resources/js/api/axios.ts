//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import axiosDefault from 'axios'

//-----------------------------------------------------------------------------
// Attach X-CSRF token to each request
//-----------------------------------------------------------------------------
const token: HTMLMetaElement = document.querySelector('meta[name="csrf-token"]')
let axiosWithToken = axiosDefault

if (axiosWithToken?.defaults?.headers?.common) {
  axiosWithToken.defaults.headers.common['X-CSRF-TOKEN'] = token !== null ? token.content : null
  axiosWithToken.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
}

//-----------------------------------------------------------------------------
// Cancel the request if it originates from a demo user
//-----------------------------------------------------------------------------
axiosWithToken?.interceptors?.request?.use(
  config => {
    // This is a bit of a hack, but without access to the redux store (which I'm
    // open to hooking up here but feel this is a simpler solution), the best
    // way to figure out the type of user currently logged in is to access
    // it from the initial user data. 
    const isDemoUser = initialData?.user?.tasksheetSubscription?.type === 'TRIAL'
    
    if(isDemoUser 
      && config.method !== "get"
      && config.url !== "/user/login" // User login
      && config.url !== "/user/register" // User register
    ) {
       return {
         ...config,
         cancelToken: new axiosDefault.CancelToken((cancel: any) => cancel('Demo users are not allowed to save changes'))
       }
    }
    else {
      return { ...config }
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default axiosWithToken
