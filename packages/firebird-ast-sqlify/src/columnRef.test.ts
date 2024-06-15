import { ColumnRef, columnRefSchema, sqlifyColumnRef } from './columnRef'
import { describe, expect, it } from 'bun:test'

const columnReExample: ColumnRef = {
  type: 'column_ref',
  table: 'colors',
  column: 'colorname',
}

const columnReExampleInBackticks: ColumnRef = {
  type: 'column_ref',
  table: {
    type: 'backticks_quote_string',
    value: 'colors',
  },
  column: 'colorname',
}

describe('columnRefSchema', () => {
  it('columnRefSchema', () => {
    const valid = columnRefSchema.safeParse(columnReExample)
    expect(valid.success).toBe(true)
  })

  it('columnRefSchema with backticks', () => {
    const valid = columnRefSchema.safeParse(columnReExampleInBackticks)
    expect(valid.success).toBe(true)
  })
})

describe('sqlifyColumnRef', () => {
  it('should return `colors.colorname`', () => {
    expect(sqlifyColumnRef(columnReExample)).toBe('colors.colorname')
  })

  it('should return `colors.colorname` without backticks', () => {
    expect(sqlifyColumnRef(columnReExampleInBackticks)).toBe('colors.colorname')
  })
})
