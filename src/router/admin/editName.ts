import { Router } from 'express'
import { query } from '../../utils/db'
import to from 'await-to-js'
import execute from '../../mcsmApi/execute'
import config from '../../utils/config'
import sqlLog from '../../utils/sqlLog'
import sleep from '../../utils/sleep'

const router = Router()

const executeEdit = async (oldName: string, newName: string) => {
  const remove = await execute(config.mcsm.removeWhitelist.replace('{id}', oldName))
  console.log((remove.data))
  if (remove.data.status != 200) {
    return '白名单删除失败'
  }
  await sleep(1200)
  const add = await execute(config.mcsm.addWhitelist.replace('{id}', newName))
  console.log(add.data)
  if (add.data.status != 200) {
    return '白名单删除成功(可能)，但添加失败'
  }
}

router.post('/', async (req, res) => {
  const { id, newName } = req.body
  const user = req.user as any

  if (!newName) {
    return res.send({ code: 403, msg: '请填写name' })
  }

  let err, results

  [err, results] = await to(query('select * from players where id=?', id))
  if (err) {
    return { code: 500, msg: '查找玩家出错' }
  }
  if (results.length != 1) {
    return { code: 403, msg: '未找到玩家' }
  }

  console.log((results))

  const oldName = results[0].name

  // 删除 添加
  const msg = await executeEdit(oldName, newName)
  if (msg) {
    console.log(msg)

    return res.send({ code: 403, msg })
  }

  [err, results] = await to(query('update players set name=? where id=?', [newName, id]))
  if (err) {
    return { code: 500, msg: 'players更新失败' }
  }

  [err, results] = await to(query('insert into edit_name set ?', {
    user: id,
    old_name: oldName,
    new_name: newName,
    date: new Date(),
    operator: user.id
  }))
  if (err) {
    return { code: 500, msg: '修改日志插入失败' }
  }

  sqlLog(user.id, `更新玩家id ${oldName} 为 ${newName}`, results.insertId)

  res.send({ code: 200 })
})

export default router