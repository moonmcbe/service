import { Router } from 'express'
import { query } from '../utils/db'
import to from 'await-to-js'
import token from '../utils/token'

const router = Router()

const sql = `
select * from
  verification_code
where
  date>=DATE_SUB(NOW(),INTERVAL 5 MINUTE) and code=? and qq=? and status=0;`
router.post('/', async (req, res) => {
  const { qq, code, keepLogin } = req.body
  let err,
    results
    // 查验证码
    ;[err, results] = await to(query(sql, [code, qq]))
  if (err) {
    return res.send({ code: 500 })
  }
  if (results.length < 1) {
    return res.send({ code: 403, msg: '验证码错误' })
  }
  // 废弃验证码
  ;[err, results] = await to(
    query('update verification_code set status=1 where id=?;', results[0].id)
  )
  if (err) {
    return res.send({ code: 500 })
  }
  // 获取账号数据
  ;[err, results] = await to(query('select * from users where qq=?;', qq))
  if (results.length < 1) {
    return res.send({ code: 403, msg: '暂未开放注册' })
  }

  res.send({
    code: 200, token: token({ ...results[0] }, keepLogin ? '7d' : '24h')
  })
})

export default router