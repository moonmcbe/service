import WebSocket from 'ws'
import config from './config'
import type data from '../types/data'
import type { MessageChain } from '../types/data'

const ws = new WebSocket(
  `ws://${config.bot.host}:${config.bot.port}/all?verifyKey=${config.bot.verifyKey}&qq=${config.bot.qq}`
)

ws.onerror = (e) => {
  console.error('ws error', e)
}

const send = (json: any) => {
  if (typeof json == 'object') {
    return ws.send(JSON.stringify(json))
  } else {
    return ws.send(json.toString())
  }
}

const sendGroupMessage = (
  id: number,
  messageChain: MessageChain[],
  syncId = 123
) => {
  send({
    syncId, // 消息同步的字段
    command: 'sendGroupMessage', // 命令字
    content: {
      group: id,
      messageChain
    }
  })
}

const message = (data: (data: data) => void) => {
  ws.on('message', (e) => {
    try {
      // @ts-ignore
      const message = JSON.parse(e)
      data(message)
      // if (message.data.type) {
      // } else {
      //   console.log('无type参数消息', message)
      // }
    } catch (e) {
      console.log(e)
    }
  })
}

if (config.debug) {
  message((data) => {
    console.log(JSON.stringify(data))
  })
}

export { send, ws, message, sendGroupMessage }
