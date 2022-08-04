import { query } from './db'
import to from 'await-to-js'

export default (user: number, note: string, id: number) => {
  return to(query('insert into logs set ?', {
    user,
    note,
    event_id: id,
    date: new Date()
  }))
}