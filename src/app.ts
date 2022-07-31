import express from 'express'
import config from './utils/config'
import bodyParser from 'body-parser'
import router from './router'
import cors from 'cors'
import './bot/getVerificationCode'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())

app.use('/api', router)

app.listen(config.port, () => {
  console.log(`http://localhost:${config.port}`)
})