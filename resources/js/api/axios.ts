import axiosDefault from 'axios'

const token: HTMLMetaElement = document.querySelector('meta[name="csrf-token"]')
let axiosWithToken = axiosDefault

if (axiosWithToken && axiosWithToken.defaults && axiosWithToken.defaults.headers && axiosWithToken.defaults.headers.common) {
  axiosWithToken.defaults.headers.common['X-CSRF-TOKEN'] = token !== null ? token.content : null
  axiosWithToken.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
}

export default axiosWithToken
