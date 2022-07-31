import cos from './cos'
import config from './config'

export default (filename: string, buffer: Buffer) => {
  return new Promise((resolve, reject) => {
    cos.putObject(
      {
        Bucket: config.Bucket /* 必须 */,
        Region: config.Region /* 必须 */,
        Key: filename /* 必须 */,
        Body: buffer
      },
      function (err, data) {
        resolve(data)
      }
    )
  })
}