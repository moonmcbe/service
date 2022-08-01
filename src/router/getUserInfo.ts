import { Router } from 'express'

const router = Router()

router.post('/', (req, res) => {
  const user = req.user as any

  const { id, username, permissions, status, qq } = user

  res.send({
    code: 200, data: {
      id, username, permissions, status, qq
    }
  })
})

export default router