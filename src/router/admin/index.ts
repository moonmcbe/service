import { Router } from 'express'
import overview from './overview'
import audit from './audit'
import players from './players'
import editName from './editName'
import setStatus from './setStatus'

const router = Router()

router.use('/overview', overview)
router.use('/audit', audit)
router.use('/players', players)
router.use('/edit_name', editName)
router.use('/set_status', setStatus)

export default router
