import WebSocket from 'ws'
import config from './config'
import type data from '../types/data'

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

const message = (data: (data: data) => void) => {
  ws.on('message', (e) => {
    try {
      // @ts-ignore
      data(JSON.parse(e))
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

export { send, ws, message }