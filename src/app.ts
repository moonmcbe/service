import express from 'express'
import config from './utils/config'
import bodyParser from 'body-parser'
import router from './router'
import cors from 'cors'
import './bot/getVerificationCode'
import './bot/groupEvent'
import expressJWT from 'express-jwt'
import JWTUnless from './utils/JWTUnless'
import './service/check'

console.log('debug', config.debug)

const app = express()

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 中间件记录日志
app.use('*', (req: any, res, next) => {
  // 用于记录特定时间的日志输出

  try {
    req.userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  } catch (e) {
    console.log(e)
  }
  next()
  console.log(
    `${new Date()} ip:${req.userIp}  请求:${req.path}  user-agent:${
      req.headers['user-agent']
    }`
  )
})

app.use(
  expressJWT({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({
    path: JWTUnless
  })
)

// 错误中间件
app.use(
  (
    err: express.Errback,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // 省略其它代码...

    // 捕获身份认证失败的错误
    if (err.name === 'UnauthorizedError')
      return res.send({ code: 401, msg: '认证失败，请重新登录' })

    // 未知错误...
  }
)

app.use(config.baseUrl, router)

app.listen(config.port, () => {
  console.log(`http://localhost:${config.port}`)
})
