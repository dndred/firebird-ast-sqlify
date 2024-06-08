import { sqlifyTableName, TableName, tableNameSchema } from './table-name'
import { describe, expect, it } from 'bun:test'

const tableNameExample: TableName = {
  db: null,
  table: 'colors',
  as: null,
}

const tableNameExampleWithAlias: TableName = {
  db: 'public',
  table: 'colors',
  as: 'c',
}

describe('tableNameSchema', () => {
  it('tableNameSchema', () => {
    expect(tableNameSchema.parse(tableNameExample)).toEqual(tableNameExample)
  })

  it('tableNameSchema with alias', () => {
    expect(tableNameSchema.parse(tableNameExampleWithAlias)).toEqual(tableNameExampleWithAlias)
  })
})

describe('sqlifyTableName', () => {
  it('should return `colors`', () => {
    expect(sqlifyTableName(tableNameExample)).toBe('colors')
  })

  it('should return `public.colors as c`', () => {
    expect(sqlifyTableName(tableNameExampleWithAlias)).toBe('colors as c')
  })
})
