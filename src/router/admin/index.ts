import { Router } from 'express'
import overview from './overview'

const router = Router()

router.use('/overview', overview)

export default router