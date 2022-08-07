import config from './config'

const unless: string[] = [
  '/query',
  '/upload',
  '/submit',
  '/validation',
  '/login'
]

export default unless.map((e) => new RegExp(`^${config.baseUrl == '/' ? '' : config.baseUrl}${e}`))

console.log(unless.map((e) => new RegExp(`^${config.baseUrl == '/' ? '' : config.baseUrl}${e}`)))