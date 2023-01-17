import request from './request'
import config from '../utils/config'

export default (command: string) => request({
  url: '/api/protected_instance/command',
  method: 'get',
  params: {
    // name: config.mcsm.name,
    uuid:config.mcsm.uuid,
    remote_uuid: config.mcsm.remote_uuid,
    command
  }
})