import { parse } from 'yaml'
import { readFileSync, existsSync } from 'fs'

let config

if (existsSync('./config.yml')) {
  config = parse(readFileSync('./config.yml', 'utf8'))
} else {
  console.log('请创建config.yml')
}

export default {
  port: config?.port || 3000,
  baseUrl: config.baseUrl || '/api',
  jwtSecretKey: '123456abc' || config.jwtSecretKey,
  mcsm: {
    url: config.mcsm.url,
    apiKey: config.mcsm.apiKey,
    name: config.mcsm.name,
    addWhitelist: config.mcsm.addWhitelist || 'whitelist add {id}',
    removeWhitelist: config.mcsm.removeWhitelist || 'whitelist remove {id}'
  },
  mysql: {
    host: config?.mysql?.host,
    port: config?.mysql?.port,
    user: config?.mysql?.user,
    password: config?.mysql?.password,
    database: config?.mysql?.database
  },
  bot: {
    host: config.bot.host,
    port: config.bot.port,
    verifyKey: config.bot.verifyKey,
    qq: config.bot.qq
  },
  SecretId: config?.SecretId,
  SecretKey: config?.SecretKey,
  Bucket: config.Bucket,
  Region: config.Region
}