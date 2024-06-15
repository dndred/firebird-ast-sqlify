import { describe, expect, it } from 'bun:test'
import { convertQueryToFirebird } from './'

describe('simple select with args', () => {
  it('one where arg', () => {
    const sql = 'SELECT id, colorname FROM colors where id = ?'
    const args = [1]
    expect(convertQueryToFirebird({ sql, args })).toMatchObject({
      sql,
      args,
    })
  })

  it('without args', () => {
    const sql = 'SELECT id, colorname FROM colors'
    const args = []
    expect(convertQueryToFirebird({ sql, args })).toMatchObject({
      sql,
      args,
    })
  })

  it('with limit', () => {
    const sql = 'SELECT id, colorname FROM colors limit ?'
    const resultSql = 'SELECT first ? id, colorname FROM colors'
    const args = [10]
    expect(convertQueryToFirebird({ sql, args })).toMatchObject({
      sql: resultSql,
      args,
    })
  })

  it('with limit and offset', () => {
    const sql = 'SELECT id, colorname FROM colors limit ? offset ?'
    const resultSql = 'SELECT first ? skip ? id, colorname FROM colors'
    const args = [10, 3]
    expect(convertQueryToFirebird({ sql, args })).toMatchObject({
      sql: resultSql,
      args,
    })
  })

  it('with limit and where argument', () => {
    const sql = 'SELECT id, colorname FROM colors where id = ? limit ?'
    const args = [100, 10]

    const resultSql = 'SELECT first ? id, colorname FROM colors where id = ?'
    const resultArgs = [10, 100]
    expect(convertQueryToFirebird({ sql, args })).toMatchObject({
      sql: resultSql,
      args: resultArgs,
    })
  })

  it('with limit, offset and where arguments', () => {
    const sql = 'SELECT id, colorname FROM colors where id = ? limit ? offset ?'
    const args = [100, 10, 3]

    const resultSql = 'SELECT first ? skip ? id, colorname FROM colors where id = ?'
    const resultArgs = [10, 3, 100]
    expect(convertQueryToFirebird({ sql, args })).toMatchObject({
      sql: resultSql,
      args: resultArgs,
    })
  })
})
