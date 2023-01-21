import { Router } from 'express'
import { query } from '../../utils/db'
import to from 'await-to-js'
import execute from '../../mcsmApi/execute'
import config from '../../utils/config'
import sqlLog from '../../utils/sqlLog'
import sleep from '../../utils/sleep'
import dayjs from 'dayjs'

const router = Router()

router.post('/', async (req, res) => {
  const { id, newStatus, duration, note, cause } = req.body
  const user = req.user as any
  let err, results
  ;[err, results] = await to(query('select * from players where id=?', id))
  if (err) {
    return { code: 500, msg: '查找玩家出错' }
  }
  if (results.length != 1) {
    return { code: 403, msg: '未找到玩家' }
  }
  const oldStatus = results[0]?.status
  // 删的
  if ([0, 2, 3, 4, 5].includes(newStatus)) {
    const { data } = await execute(
      config.mcsm.removeWhitelist.replace('{id}', results[0]?.name)
    )
    console.log(data)
    if (data.status != 200) {
      console.log(data)
      return res.send({ code: 500, msg: '白名单删除失败' })
    }
  } else {
    const { data } = await execute(
      config.mcsm.addWhitelist.replace('{id}', results[0]?.name)
    )
    console.log(data)

    if (data.status != 200) {
      console.log(data)
      return res.send({ code: 500, msg: '白名单添加失败' })
    }
  }
  let endTime = null
  if (duration) {
    endTime = dayjs().add(duration, 'ms')
  }
  // 改数据
  ;[err, results] = await to(
    query('update players set ? where id=?', [{ status: newStatus }, id])
  )
  if (err) {
    return { code: 500, msg: '修改players数据出错' }
  }
  // 封禁记录
  if (newStatus == 2 || newStatus == 3) {
    ;[err, results] = await to(query('select * from ban_log where id=?', id))
    if (err) {
      return { code: 500, msg: '查询ban_log数据出错' }
    }
    // 还在被封禁
    if (results[0]) {
      // 废除
      ;[err, results] = await to(
        query('update ban_log set status=2 where id=?', id)
      )
    }
    // 插入新的
    to(
      query('insert into ban_log set ?', {
        user: id,
        start_time: new Date(),
        end_time: endTime,
        old_status: oldStatus,
        new_status: newStatus,
        cause,
        note,
        status: 1,
        operator: user.id,
        date: new Date(),
        duration
      })
    )
  }
  // 修改记录
  ;[err, results] = await to(
    query('insert into set_status set ?', {
      user: id,
      old_status: oldStatus,
      new_status: newStatus,
      duration,
      end_time: endTime,
      date: new Date(),
      operator: user.id,
      note,
      cause
    })
  )
  if (err) {
    return { code: 500, msg: '插入set_status数据出错' }
  }
  sqlLog(user.id, `修改玩家状态为 ${newStatus}, 持续到${endTime}`, id)
  res.send({ code: 200 })
})

export default router
