import { describe, expect, it } from 'bun:test'
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
})
