import { Router } from 'express'
import { query } from '../utils/db'
import to from 'await-to-js'
import { send } from '../utils/ws'
import config from '../utils/config'
import { sendSubmitMail } from '../utils/email'

const router = Router()

const sendMessage = (text: string, url: string) => {
  send({
    'syncId': 123, // 消息同步的字段
    'command': 'sendGroupMessage', // 命令字
    'content': {
      group: config.bot.admin_group,
      messageChain: [
        {
          type: 'Plain',
          text
        },
        {
          type: 'Image',
          url
        }
      ]
    }
  })
}

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

  const auditId = results[0]?.id
  const qq = results[0]?.qq
  const name = results[0]?.name
  const image = results[0]?.upload
  const email = results[0]?.email

  if (results.length < 1) {
    return res.send({ code: 403, msg: '验证码错误' })
  }
  // 查验证码
  ;[err, results] = await to(query(sql, [code, qq]))
  if (err) {
    return res.send({ code: 500 })
  }
  if (results.length < 1) {
    return res.send({ code: 403, msg: '验证码错误' })
  }
  // 更新审核状态
  ;[err] = await to(query('update audit set status=1 where id=?;', auditId))
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

  // 邮件通知玩家
  console.log(email)
  email &&
    sendSubmitMail(email, name, `https://moon.mcxing.cn/check/${auditId}`)

  // qq管理群通知
  sendMessage(`玩家${name} ${qq} 申请白名单`, 'https:' + image)
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
