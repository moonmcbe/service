import { Router } from 'express'
import overview from './overview'
import audit from './audit'
import players from './players'
import editName from './editName'

const router = Router()

router.use('/overview', overview)
router.use('/audit', audit)
router.use('/players', players)
router.use('/edit_name', editName)

export default router