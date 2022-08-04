import { Router } from 'express'
import { query } from '../utils/db'
import to from 'await-to-js'

const router = Router()

const sql = `
select * from
  verification_code
where
  date>=DATE_SUB(NOW(),INTERVAL 5 MINUTE) and code=? and qq=? and status=0;`
router.post('/', async (req, res) => {
  const { id, code } = req.body
  let err,
    results
    // 通过id查信息
    ;[err, results] = await to(
      query('select * from audit where id=? and status=0', id)
    )
  if (err) {
    return res.send({ code: 500 })
  }
  if (results.length < 1) {
    return res.send({ code: 403, msg: '验证码错误' })
  }
  // 查验证码
  ;[err, results] = await to(query(sql, [code, results[0].qq]))
  if (err) {
    return res.send({ code: 500 })
  }
  if (results.length < 1) {
    return res.send({ code: 403, msg: '验证码错误' })
  }
  // 更新审核状态
  ;[err] = await to(
    query('update audit set status=1 where id=?;', results[0].id)
  )
  if (err) {
    return res.send({ code: 500 })
  }
  // 废弃验证码
  ;[err] = await to(
    query('update verification_code set status=1 where id=?;', results[0].id)
  )
  if (err) {
    return res.send({ code: 500 })
  }

  res.send({ code: 200 })
})

router.post('/check', async (req, res) => {
  const { id } = req.body
  const [err, results] = await to(query('select * from audit where id=?', id))
  if (err) {
    return res.send({ code: 500 })
  }
  res.send({ code: 200, data: results[0] })
})

export default router