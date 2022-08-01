import { Router } from 'express'
import { query } from '../utils/db'
import to from 'await-to-js'

const router = Router()

router.post('/', async (req, res) => {
  const {
    qq,
    name,
    bili_username: biliUsername,
    bili_uid: biliUid,
    upload
  } = req.body

  if (
    !/^([a-zA-Z])([a-zA-Z0-9 ]{1,14})$/.test(name) ||
    !/^[1-9][0-9]{4,10}$/.test(qq) ||
    biliUsername.length > 20 ||
    !/^[1-9][0-9]{0,19}$/.test(biliUid) ||
    upload.length < 10 ||
    upload.length > 1000
  ) {
    return res.send({ status: 403 })
  }

  const [err, results] = await to(
    query('insert into audit set ?', {
      qq,
      name,
      bili_username: biliUsername,
      bili_uid: biliUid,
      upload
    })
  )
  if (err) {
    return res.send({ coe: 500 })
  }
  res.send({ code: 200, id: results.insertId })
})

export default router