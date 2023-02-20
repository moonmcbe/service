import { Router } from 'express'
import { query } from '../../utils/db'
import to from 'await-to-js'
import execute from '../../mcsmApi/execute'
import config from '../../utils/config'
import sqlLog from '../../utils/sqlLog'
import { sendResultMail } from '../../utils/email'

const router = Router()

router.post('/get', async (req, res) => {
  const [err, results] = await to(query('select * from audit where status=1;'))

  if (err) {
    return res.send({ code: 500 })
  }

  res.send({ code: 200, data: results })
})

router.post('/set', async (req, res) => {
  const user = req.user as any
  const { id, allow, cause } = req.body
  let err,
    results
    // 查数据库的信息
  ;[err, results] = await to(query('select * from audit where id=?', id))
  if (results.length < 1) {
    return res.send({ code: 403, msg: '未查询到信息' })
  }
  const name = results[0].name
  const qq = results[0].qq
  const email = results[0].email
  if (allow) {
    // 加白名
    console.log((config.mcsm.addWhitelist as string).replace('{id}', name))

    const { data: res } = await execute(
      (config.mcsm.addWhitelist as string).replace('{id}', name)
    )
    console.log(res)
    if (res.status != 200) {
      console.error(res)
      return res.send({ code: 500, msg: '白名单添加失败' })
    }
    // 添加玩家
    ;[err, results] = await to(
      query('insert into players set ?', {
        id: Math.random() * 100000000,
        name,
        qq,
        date: new Date()
      })
    )
    if (err) {
      return res.send({ code: 500, msg: 'players数据库添加失败' })
    }
  }
  sqlLog(user.id, `审核结果:${allow} 原因:${cause}`, id)
  // 更新数据库
  ;[err, results] = await to(
    query('update audit set ? where id=?', [
      {
        status: allow ? 2 : 3,
        cause,
        judge: user.id
      },
      id
    ])
  )

  if (err) {
    return res.send({ code: 500 })
  }

  // 邮件通知
  // 延迟5分钟发送
  setTimeout(() => {
    email &&
      sendResultMail(
        email,
        name,
        allow ? '已通过' : '未通过',
        `${user.username} ${user.qq}`,
        cause || ''
      )
  }, 1000 * 60 * 5)

  res.send({ code: 200 })
})

export default router
