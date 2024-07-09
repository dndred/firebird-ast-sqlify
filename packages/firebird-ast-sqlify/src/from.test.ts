import { sqlifyFrom, From, fromSchema } from './from'
import { describe, expect, it } from 'bun:test'

const fromTableNameExample: From = {
  db: null,
  table: 'colors',
  as: null,
}

const fromTableNameExampleWithAlias: From = {
  db: 'public',
  table: 'colors',
  as: 'c',
}

const fromWithLeftJoinExample: From = {
  db: null,
  table: 'colors',
  as: null,
  join: 'LEFT JOIN',
  on: {
    type: 'binary_expr',
    operator: '=',
    left: {
      type: 'column_ref',
      table: 'colors',
      column: 'colorId',
    },
    right: {
      type: 'column_ref',
      table: 'items',
      column: 'colorId',
    },
  },
}

describe('tableNameSchema', () => {
  it('tableNameSchema', () => {
    expect(fromSchema.parse(fromTableNameExample)).toEqual(fromTableNameExample)
  })

  it('tableNameSchema with alias', () => {
    expect(fromSchema.parse(fromTableNameExampleWithAlias)).toEqual(fromTableNameExampleWithAlias)
  })
})

describe('sqlifyTableName', () => {
  it('should return `colors`', () => {
    expect(sqlifyFrom(fromTableNameExample)).toBe('colors')
  })

  it('should return `colors as c`', () => {
    expect(sqlifyFrom(fromTableNameExampleWithAlias)).toBe('colors as c')
  })

  it('from with left join', () => {
    expect(sqlifyFrom(fromWithLeftJoinExample)).toBe('LEFT JOIN colors ON colors.colorId = items.colorId')
  })
})
