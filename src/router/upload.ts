import { Router } from 'express'
import dayjs from 'dayjs'
import multer from 'multer'
import putObject from '../utils/putObject'
import sqlLog from '../utils/sqlLog'

const router = Router()

const upload = multer({
  // dest: 'uploads/',
  fileFilter(req, file, cb) {
    if (['image/jpeg', 'image/png'].indexOf(file.mimetype) == -1) {
      // 文件类型有误
      return cb(new Error('fileType'))
    }
    cb(null, true)
  },
  limits: {
    // http://calc.gongjuji.net/byte/
    fileSize: 10485760
  }
}).single('file')

router.post('/', async (req, res) => {

  upload(req, res, async () => {
    if (req.file?.buffer == undefined) return res.send({ code: 403 })
    const fileNameData = dayjs().format('YYYYMMDDHHmmss')
    const fileNameText = `${req.file?.originalname.replace(
      /\.(jpg|jpeg|png)$/g,
      ''
    )}`
    const fileType = req.file?.mimetype.split('/')[1]
    const fileName = `${fileNameData}-${fileNameText}.${fileType}`
    const data: any = await putObject(fileName, req.file?.buffer)
    if (data.statusCode != 200) {
      return res.send({ code: 500 })
    }

    sqlLog(0, `上传图片 ${fileName}`, 0)

    res.send({ code: 200, fileName, Location: data.Location })
  })
})

export default router