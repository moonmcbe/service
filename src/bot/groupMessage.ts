import { send, message } from '../utils/ws'
import config from '../utils/config'
import type data from '../types/data'

const groupMessage = (fn: (data: data) => void) => {
  message((data) => {
    fn(data)
  })
}

// 获取验证码提示
groupMessage((data) => {
  if (
    data?.data?.messageChain &&
    // data?.data?.messageChain[1]?.text == '获取验证码' &&
    data?.data?.type == 'GroupMessage' &&
    data?.data?.sender?.group?.id == config.bot.group
  ) {
    // 群消息
    console.log('群消息', data)
    data?.data?.messageChain?.forEach((e) => {
      if (e.text?.trim() == '获取验证码') {
        send({
          'syncId': 123, // 消息同步的字段
          'command': 'sendGroupMessage', // 命令字
          'content': {
            group: config.bot.group,
            messageChain: [
              {
                type: 'Plain',
                text: '请私聊发送 “获取验证码”'
              }
            ]
          }
        })
      }
    })
  }
})
