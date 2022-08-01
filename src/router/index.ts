import { Router } from 'express'
import query from './query'
import upload from './upload'
import submit from './submit'
import validation from './validation'
import login from './login'
import getUserInfo from './getUserInfo'

const router = Router()

router.use('/query', query)
router.use('/upload', upload)
router.use('/submit', submit)
router.use('/validation', validation)
router.use('/login', login)
router.use('/getUserInfo', getUserInfo)

export default router