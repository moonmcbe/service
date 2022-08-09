import { Router } from 'express'
import { query } from '../../utils/db'
import to from 'await-to-js'
import execute from '../../mcsmApi/execute'
import config from '../../utils/config'
import sqlLog from '../../utils/sqlLog'

const router = Router()

router.post('/get', async (req, res) => {
  const { oldPlayer } = req.body

  const [err, results] = await to(query('select * from players'))

  if (err) {
    return res.send({ code: 500 })
  }

  let oldData, err2
  oldData = []
  if (oldPlayer) {
    [err2, oldData] = await to(query('select * from old_players'))

    if (err2) {
      return res.send({ code: 500 })
    }
  }

  res.send({ code: 200, data: [...results, ...oldData] })
})

export default router