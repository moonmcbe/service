import { Router } from 'express'
import overview from './overview'
import audit from './audit'

const router = Router()

router.use('/overview', overview)
router.use('/audit', audit)

export default router