import { SelectColumn, selectColumnSchema, sqlifySelectColumn } from './selectColumn'
import { describe, expect, it } from 'bun:test'

const selectColumn: SelectColumn = {
  expr: {
    type: 'column_ref',
    table: 'c',
    column: 'id',
  },
  as: null,
}
const selectColumnWithAlias: SelectColumn = {
  expr: {
    type: 'column_ref',
    table: 'c',
    column: 'id',
  },
  as: 'colorId',
}

const columnRefExampleConstant: SelectColumn = {
  expr: {
    type: 'number',
    value: 1,
  },
  as: 'id',
}

describe('selectColumnSchema', () => {
  it('should pass with selectColumn', () => {
    const valid = selectColumnSchema.safeParse(selectColumn)
    expect(valid.success).toBe(true)
  })

  it('should pass with selectColumn with alias', () => {
    const valid = selectColumnSchema.safeParse(selectColumnWithAlias)
    expect(valid.success).toBe(true)
  })

  it('should pass with columnRefExampleConstant', () => {
    const valid = selectColumnSchema.safeParse(columnRefExampleConstant)
    expect(valid.success).toBe(true)
  })
})

describe('sqlifySelectColumn', () => {
  it('should return `c.id`', () => {
    expect(sqlifySelectColumn(selectColumn)).toBe('c.id')
  })

  it('should return `c.id as colorId`', () => {
    expect(sqlifySelectColumn(selectColumnWithAlias)).toBe('c.id as colorId')
  })

  it('should return `1 as id`', () => {
    expect(sqlifySelectColumn(columnRefExampleConstant)).toBe('1 as id')
  })
})
