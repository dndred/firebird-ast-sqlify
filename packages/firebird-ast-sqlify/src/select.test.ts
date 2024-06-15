import { describe, expect, it } from 'bun:test'
import { convertSqlToFirebird } from './index'

describe('simple select', () => {
  it('simple select', () => {
    const sql = 'select id, colorname from colors'
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(sql.toLowerCase())
  })

  it('simple select with where', () => {
    const sql = 'select id, colorname from colors where id = 1'
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(sql.toLowerCase())
  })

  it('simple select with where and >', () => {
    const sql = 'select id, colorname from colors where id > 1'
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(sql.toLowerCase())
  })

  it('simple select with where and >', () => {
    const sql = 'select id, colorname from colors where id < 1'
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(sql.toLowerCase())
  })

  it('simple select with where and <>', () => {
    const sql = 'select id, colorname from colors where id <> 1'
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(sql.toLowerCase())
  })

  it('simple select with where and >=', () => {
    const sql = 'select id, colorname from colors where id >= 1'
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(sql.toLowerCase())
  })

  it('simple select with where string equal condition', () => {
    const sql = `select id, colorname from colors where colorname = 'red'`
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(sql.toLowerCase())
  })

  it('simple select with where const integer condition', () => {
    const sql = `select id, colorname from colors where 1 = 1`
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(sql.toLowerCase())
  })

  it('simple select with where const string condition', () => {
    const sql = `select id, colorname from colors where 'красный' <> 'red'`
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(sql.toLowerCase())
  })

  it('simple select with where two columns condition', () => {
    const sql = `select id, colorname from colors where id <> colorname`
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(sql.toLowerCase())
  })

  it('simple select with where two columns condition and table name prefix', () => {
    const sql = `select id, colorname from colors where colors.id <> colorname`
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(sql.toLowerCase())
  })
})

describe('select with table alias', () => {
  it('simple select with table alias', () => {
    const sql = 'select c.id, c.colorname from colors as c'
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(sql.toLowerCase())
  })

  it('simple select with table alias and where', () => {
    const sql = 'select c.id, c.colorname from colors as c where c.id = 1'
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(sql.toLowerCase())
  })
})

describe('select with limit and offset', () => {
  it('select with limit', () => {
    const sql = `select id, colorname from colors limit 10`
    const resultSql = `select first 10 id, colorname from colors`
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(resultSql.toLowerCase())
  })

  it('select with limit and offset', () => {
    const sql = `select id, colorname from colors limit 10 offset 5`
    const resultSql = `select first 10 skip 5 id, colorname from colors`
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(resultSql.toLowerCase())
  })

  it('select with limit and offset and where', () => {
    const sql = `select id, colorname from colors where id = 1 limit 10 offset 5`
    const resultSql = `select first 10 skip 5 id, colorname from colors where id = 1`
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(resultSql.toLowerCase())
  })
})

describe('select with WHERE with AND and OR', () => {
  it('WHERE with AND', () => {
    const sql = `select id, colorname from colors where id = 1 and colorname = 'red'`
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(sql.toLowerCase())
  })

  it('WHERE with two AND', () => {
    const sql = `select id, colorname from colors where id = 1 and colorname = 'red' and id = 2`
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(sql.toLowerCase())
  })

  it('WHERE with OR', () => {
    const sql = `select id, colorname from colors where id = 1 or id = 2`
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(sql.toLowerCase())
  })

  it('WHERE with two OR', () => {
    const sql = `select id, colorname from colors where id = 1 or id = 2 or id = 3`
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(sql.toLowerCase())
  })

  it('WHERE with AND in parentheses', () => {
    const sql = `select id, colorname from colors where (id = 1 and colorname = 'red')`
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(sql.toLowerCase())
  })

  it('WHERE with AND and OR in parentheses 1', () => {
    const sql = `select id, colorname from colors where (id = 1 and colorname = 'red') or id = 2`
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(sql.toLowerCase())
  })

  it('WHERE with AND and OR in parentheses 2', () => {
    const sql = `select id, colorname from colors where ((id = 1 and colorname = 'red') or id = 2) and id = 3`
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(sql.toLowerCase())
  })
  it('WHERE with AND and OR in parentheses 3', () => {
    const sql = `select id, colorname from colors where ((id = 1 and colorname = 'red') or id = 2) and (id = 3 or id = 4)`
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(sql.toLowerCase())
  })
})

describe('prisma specific formatting', () => {
  it('prisma select with backticks_quote_string', () => {
    const sql =
      'SELECT `mysql`.`colors`.`colorid`, `mysql`.`colors`.`colorname` FROM `mysql`.`colors` WHERE 1=1 LIMIT ? OFFSET ?'
    const resultSql = `SELECT first ? skip ? colors.colorid, colors.colorname FROM colors where 1 = 1`
    expect(convertSqlToFirebird(sql).toLowerCase()).toBe(resultSql.toLowerCase())
  })
})
