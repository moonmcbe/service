import nodemailer from 'nodemailer'
import config from '../utils/config'
import { readFileSync } from 'fs'

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.secure, // true for 465, false for other ports
  auth: {
    user: config.smtp.auth.user, // generated ethereal user
    pass: config.smtp.auth.pass // generated ethereal password
  }
})

// .bind(transporter) https://github.com/nodemailer/nodemailer/issues/759
export const sendMail = transporter.sendMail.bind(transporter)

const replaceString = (str: string, data: { key: string; value: string }[]) => {
  let result = str
  data.forEach((e) => {
    result = result.replaceAll(`{ ${e.key} }`, e.value)
  })
  return result
}

export const sendResultMail = (
  to: string,
  name: string,
  result: string,
  auditor: string,
  comment: string
) => {
  const html = readFileSync('./emailTemplate/result.html', 'utf-8')
  transporter.sendMail({
    from: config.smtp.from,
    to,
    subject: '审核结果通知',
    html: replaceString(html, [
      { key: 'name', value: name },
      { key: 'result', value: result },
      { key: 'auditor', value: auditor },
      { key: 'comment', value: comment }
    ])
  })
}
export const sendSubmitMail = (to: string, name: string, link: string) => {
  const html = readFileSync('./emailTemplate/submit.html', 'utf-8')
  transporter.sendMail({
    from: config.smtp.from,
    to,
    subject: '审核提交通知',
    html: replaceString(html, [
      { key: 'name', value: name },
      { key: 'link', value: link }
    ])
  })
}
