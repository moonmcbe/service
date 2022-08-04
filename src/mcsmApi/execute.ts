import request from './request'
import config from '../utils/config'

export default (command: string) => request({
  url: '/api/execute/',
  method: 'post',
  data: {
    name: config.mcsm.name,
    command
  }
})