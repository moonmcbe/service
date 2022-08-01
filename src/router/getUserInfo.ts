import { Router } from 'express'

const router = Router()

router.post('/', (req, res) => {
  const user = req.user as any
  console.log(user)

  res.send()
})

export default router