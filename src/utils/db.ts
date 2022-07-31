import mysql from 'mysql'
import config from './config'

const { host, user, password, database, port } = config.mysql

const db = mysql.createPool({
  host,
  port,
  user,
  password,
  database
})

export default db

/**
 * (sql: string, values?: any) => [err, results]
 */
export const query = (sql: string, values: any = '') => {
  return new Promise<any>((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) {
        console.log('数据库报错', err)
        reject(err)
      }
      // resolve([err, results])
      resolve(results)
    })
  })
}