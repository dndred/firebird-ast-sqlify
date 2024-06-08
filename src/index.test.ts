import { expect, describe, it } from 'bun:test'
import { convertSqlToFirebird } from './index'

describe('select', () => {
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
