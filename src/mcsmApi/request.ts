import axios from 'axios'
import config from '../utils/config'

axios.defaults.baseURL = config.mcsm.url

// http request 拦截器
axios.interceptors.request.use(
  e => {
    if (!e.params) {
      e.params = {}
    }

    e.params.apikey = config.mcsm.apiKey
    return e
  },
  err => {
    return Promise.reject(err)
  }
)

export default axios