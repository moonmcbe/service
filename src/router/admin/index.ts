import { Router } from 'express'
import overview from './overview'
import audit from './audit'
import players from './players'

const router = Router()

router.use('/overview', overview)
router.use('/audit', audit)
router.use('/players', players)

export default router