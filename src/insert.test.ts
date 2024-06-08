import { describe, expect, it } from 'bun:test'
import { convertSqlToFirebird } from './index'

describe('insert', () => {
  it('simple insert', () => {
    const sql = `insert into colors (id, name) values (1, 'red')`
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(sql.toLowerCase())
  })

  it('simple insert with unicode', () => {
    const sql = `insert into colors (id, name) values (1, 'красный')`
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(sql.toLowerCase())
  })

  it('simple insert with unicode', () => {
    const sql = `insert into colors (id, name) values (?, ?)`
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(sql.toLowerCase())
  })
})
