import { query } from './../utils/db'
import { message, send } from '../utils/ws'
import to from 'await-to-js'

message(async (data) => {
  // console.log(JSON.stringify(data))

  if (
    data?.data?.messageChain &&
    data?.data?.messageChain[1]?.text == '获取验证码' &&
    (data?.data?.type == 'TempMessage' || data?.data?.type == 'FriendMessage')
  ) {
    const code = Math.floor(Math.random() * 100000)
    const [err, results] = await to(
      query('insert into verification_code set ?', {
        qq: data.data.sender.id,
        code: code,
        date: new Date()
      })
    )
    const target = data.data.sender.id
    const type = 'send' + data.data.type
    const group = data.data.sender?.group?.id
    console.log({
      'syncId': 123, // 消息同步的字段
      'command': type, // 命令字
      'content': {
        qq: target,
        group,
        messageChain: [
          {
            type: 'Plain'
          }
        ]
      }
    })

    const sendMessage = (text: string) => {
      send({
        'syncId': 123, // 消息同步的字段
        'command': type, // 命令字
        'content': {
          qq: target,
          group,
          messageChain: [
            {
              type: 'Plain',
              text
            }
          ]
        }
      })
    }
    if (err) {
      return sendMessage('获取失败，请稍后再试或联系管理员')
    }
    sendMessage(
      `【庄主基岩服白名单申请】验证码是 ${code}, 5分钟内有效，请勿告诉他人`
    )
  }
})