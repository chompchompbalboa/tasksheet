//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import axiosDefault from 'axios'

//-----------------------------------------------------------------------------
// Attach X-CSRF token to each request
//-----------------------------------------------------------------------------
const token: HTMLMetaElement = document.querySelector('meta[name="csrf-token"]')
let axiosWithToken = axiosDefault

if (axiosWithToken && axiosWithToken.defaults && axiosWithToken.defaults.headers && axiosWithToken.defaults.headers.common) {
  axiosWithToken.defaults.headers.common['X-CSRF-TOKEN'] = token !== null ? token.content : null
  axiosWithToken.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
}

//-----------------------------------------------------------------------------
// Cancel the request if it originates from a demo user
//-----------------------------------------------------------------------------
axiosWithToken && axiosWithToken.interceptors && axiosWithToken.interceptors.request && axiosWithToken.interceptors.request.use(
  config => {
    // This is a bit of a hack, but without access to the redux store (which I'm
    // open to hooking up here but feel this is a simpler solution), the best
    // way to figure out the type of user currently logged in is to access
    // it from the initial user data. 
    const isDemoUser = initialData && initialData.user 
                      && initialData.user.todosheetSubscription && initialData.user.todosheetSubscription.type 
                      && initialData.user.todosheetSubscription.type === 'DEMO'
    
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
