import { Router } from 'express'
import { query } from '../../utils/db'
import to from 'await-to-js'

const router = Router()

router.post('/get', async (req, res) => {
  const [err, results] = await to(query('select * from audit where status=1 or status=0;'))

  if (err) {
    return res.send({ code: 500 })
  }

  res.send({ code: 200, data: results })
})

export default router