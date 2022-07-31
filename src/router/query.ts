import { Router } from 'express'
import { query } from '../utils/db'
import to from 'await-to-js'

const router = Router()

router.post('/', async (req, res) => {
  const { name, qq } = req.body
  const [err, results] = await to(
    query('select name, qq, date, id from users where name=? or qq=?', [
      name,
      qq
    ])
  )
  if (err) {
    return res.send({ status: 500 })
  }
  res.send({ code: 200, data: results })
})

export default router