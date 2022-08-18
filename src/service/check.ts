import cron from 'cron'
import config from '../utils/config'
import { send } from '../utils/ws'
import { query } from '../utils/db'
import to from 'await-to-js'
import dayjs from 'dayjs'

const sql = `
select * from audit where
    date<=DATE_SUB(NOW(),INTERVAL ? hour) and
    status=1
`

const sendMessage = (text: string) => {
  send({
    'syncId': 123, // 消息同步的字段
    'command': 'sendGroupMessage', // 命令字
    'content': {
      group: config.bot.admin_group,
      messageChain: [
        {
          type: 'Plain',
          text
        }
      ]
    }
  })
}

new cron.CronJob(config.cron?.check, async () => {
  const [err, results] = await to(query(sql, '24'))
  if (results) {
    results.forEach((e: any) => {
      sendMessage(`${e.id} ${e.name} ${e.qq} 已申请超过24小时，请尽快审核 申请时间：${dayjs(e.date).format('MM-DD HH:MM')}`)
    })
  }

},
  null,
  true)