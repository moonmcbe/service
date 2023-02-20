import { Router } from 'express'
import { query } from '../utils/db'
import to from 'await-to-js'
import sqlLog from '../utils/sqlLog'

const router = Router()

router.post('/', async (req, res) => {
  const {
    qq,
    name,
    bili_username: biliUsername,
    bili_uid: biliUid,
    upload,
    email
  } = req.body

  if (
    !/^([a-zA-Z])([a-zA-Z0-9 ]{1,14})$/.test(name) ||
    !/^[1-9][0-9]{4,10}$/.test(qq) ||
    biliUsername.length > 20 ||
    !/^[1-9][0-9]{0,19}$/.test(biliUid) ||
    upload.length < 10 ||
    upload.length > 1000 ||
    !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
  ) {
    return res.send({ status: 403 })
  }
  let err, results
  ;[err, results] = await to(query('select * from players where name=?;', name))
  if (err) {
    return res.send({ code: 500 })
  }
  if (results.length >= 1) {
    return res.send({ code: 403, msg: '该玩家申请过白名单' })
  }

  ;[err, results] = await to(
    query('insert into audit set ?', {
      id: Math.floor(Math.random() * 100000000),
      qq,
      name,
      bili_username: biliUsername,
      bili_uid: biliUid,
      upload,
      date: new Date(),
      email
    })
  )
  sqlLog(
    qq,
    `申请白名单${JSON.stringify({
      qq,
      name,
      bili_username: biliUsername,
      bili_uid: biliUid,
      upload,
      date: new Date(),
      email
    })}`,
    results.insertId
  )
  if (err) {
    return res.send({ coe: 500 })
  }
  res.send({ code: 200, id: results.insertId })
})

export default router
