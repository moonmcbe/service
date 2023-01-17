import { send, message, sendGroupMessage } from '../utils/ws'
import config from '../utils/config'
import type data from '../types/data'
import type event from '../types/event'
import { query } from '../utils/db'
import execute from '../mcsmApi/execute'
import sqlLog from '../utils/sqlLog'
import to from 'await-to-js'

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

// 用户退群处理
groupMessage(async (data: event) => {
  // 成员主动离群 MemberLeaveEventQuit
  if (data?.data?.type && data?.data?.type == 'MemberLeaveEventQuit') {
    const qq = data.data.member.id
    //
    const [err, results] = await to(
      query('select * from players where qq=?', [qq.toString()])
    )
    console.log(results)

    if (err) {
      sendGroupMessage(config.bot.admin_group, [
        {
          type: 'Plain',
          text: `用户${qq}退群，查询数据失败`
        }
      ])
    }
    if (!results || results.length < 1) {
      return sendGroupMessage(config.bot.group, [
        {
          type: 'Plain',
          text: `用户${qq}退群，未查询到白名单数据`
        }
      ])
    }
    //  删白名
    const { data: res } = await execute(
      (config.mcsm.removeWhitelist as string).replace('{id}', results[0].name)
    )
    if (res.status != 200) {
      console.error(res)
      return sendGroupMessage(config.bot.admin_group, [
        {
          type: 'Plain',
          text: `玩家${results[0].name}[${qq}]退群，白名单删除失败，请手动删除`
        }
      ])
    }
    // 改数据库
    let status = 5
    if (results[0].status == 2 || results[0].status == 3) {
      status = 3
    }
    await to(
      query('update players set ? where id=?', [{ status }, results[0].id])
    )
    sendGroupMessage(config.bot.group, [
      {
        type: 'Plain',
        text: `玩家${results[0].name}[${qq}]退群，已删除白名单`
      }
    ])
    sqlLog(
      111,
      `玩家${results[0].name}[${qq}]主动退群，自动删除白名单`,
      results[0].id
    )
  }

  // 用户被踢 MemberLeaveEventKick
  if (data?.data?.type == 'MemberLeaveEventKick') {
    const qq = data.data.member.id
    //
    const [err, results] = await to(
      query('select * from players where qq=?', [qq.toString()])
    )
    console.log(results)

    if (err) {
      sendGroupMessage(config.bot.admin_group, [
        {
          type: 'Plain',
          text: `用户${qq}被${data.data.operator.id}踢出群聊，查询数据失败`
        }
      ])
    }
    if (!results || results.length < 1) {
      return sendGroupMessage(config.bot.group, [
        {
          type: 'Plain',
          text: `用户${qq}被${data.data.operator.id}踢出群聊，未查询到白名单数据`
        }
      ])
    }
    //  删白名
    const { data: res } = await execute(
      (config.mcsm.removeWhitelist as string).replace('{id}', results[0].name)
    )
    if (res.status != 200) {
      console.error(res)
      return sendGroupMessage(config.bot.admin_group, [
        {
          type: 'Plain',
          text: `玩家${results[0].name}[${qq}]被${data.data.operator.id}，白名单删除失败，请手动删除`
        }
      ])
    }
    // 改数据库
    await to(
      query('update players set ? where id=?', [
        {
          status: 3
        },
        results[0].id
      ])
    )
    sendGroupMessage(config.bot.group, [
      {
        type: 'Plain',
        text: `玩家${results[0].name}[${qq}]被${data.data.operator.id}踢出群聊，已封禁`
      }
    ])
    sqlLog(
      data.data.operator.id,
      `玩家${results[0].name}[${qq}]被${data.data.operator.id}，自动删除白名单并标记封禁`,
      results[0].id
    )
  }
})
