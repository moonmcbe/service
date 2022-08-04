import { Router } from 'express'
import { query } from '../../utils/db'
import to from 'await-to-js'
import execute from '../../mcsmApi/execute'
import config from '../../utils/config'

const router = Router()

router.post('/get', async (req, res) => {
  const [err, results] = await to(query('select * from audit where status=1 or status=0;'))

  if (err) {
    return res.send({ code: 500 })
  }

  res.send({ code: 200, data: results })
})

router.post('/set', async (req, res) => {
  const user = req.user as any
  const { id, allow, cause } = req.body
  let err, results
  // 查数据库的信息
  [err, results] = await to(query('select * from audit where id=?', id))
  if (results.length < 1) {
    return res.send({ code: 403, msg: '未查询到信息' })
  }
  if (allow) {
    // 加白名
    console.log((config.mcsm.addWhitelist as string).replace('{id}', results[0].name))

    const { data: res } = await execute(
      (config.mcsm.addWhitelist as string).replace('{id}', id)
    )
    if (res.status != 200) {
      console.error(res)
      return res.send({ code: 500, msg: '白名单添加失败' })
    }
  }
  // 更新数据库
  [err, results] = await to(query('update audit set ? where id=?', [{
    status: allow ? 2 : 3,
    cause,
    judge: user.id
  }, id]))

  if (err) {
    return res.send({ code: 500 })
  }

  res.send({ code: 200 })
})

export default router