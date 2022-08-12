import jwt from 'jsonwebtoken'
import config from './config'
export default (data: object, expiresIn: string | number = '24h') => {
  // 在客户端拼接上 Bearer 的前缀
  return jwt.sign(data, config.jwtSecretKey, {
    // expiresIn: '10h' // token 有效期为 10 个小时
    expiresIn
  })
}