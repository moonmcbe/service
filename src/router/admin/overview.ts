import { Router } from 'express'
import { query } from '../../utils/db'
import to from 'await-to-js'

const router = Router()

const sql = `
select
    count(id) as count,
    sum(if(status=1, 1, 0)) as status1,
    sum(if(status=0, 1, 0)) as status0
from audit
`
router.post('/', async (req, res) => {
  const [err, results] = await to(query(sql))
  if (err) {
    return res.send({ code: 500 })
  }
  res.send({ code: 200, data: results[0] })
})

export default router