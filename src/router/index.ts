import { Router } from 'express'
import query from './query'
import upload from './upload'
import submit from './submit'
import validation from './validation'
import login from './login'

const router = Router()

router.use('/query', query)
router.use('/upload', upload)
router.use('/submit', submit)
router.use('/validation', validation)
router.use('/login', login)

export default router