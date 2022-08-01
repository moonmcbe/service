import express from 'express'
import config from './utils/config'
import bodyParser from 'body-parser'
import router from './router'
import cors from 'cors'
import './bot/getVerificationCode'
import expressJWT from 'express-jwt'
import JWTUnless from './utils/JWTUnless'

const app = express()

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

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

app.use('/api', router)

app.listen(config.port, () => {
  console.log(`http://localhost:${config.port}`)
})