import { Router } from 'express'
import query from './query'
import upload from './upload'
import submit from './submit'
import validation from './validation'

const router = Router()

router.use('/query', query)
router.use('/upload', upload)
router.use('/submit', submit)
router.use('/validation', validation)

export default router