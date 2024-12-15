import { SqlFunction, sqlFunctionSchema, sqlifyFunction } from './sqlFunction'
import { describe, expect, it } from 'bun:test'

// round(colorId)
const functionExample: SqlFunction = {
  type: 'function',
  name: {
    name: [
      {
        type: 'default',
        value: 'round',
      },
    ],
  },
  args: {
    type: 'expr_list',
    value: [
      {
        type: 'column_ref',
        table: null,
        column: 'colorId',
      },
    ],
  },
  over: null,
}

describe('sqlFunctionSchema', () => {
  it('should pass with functionExample', () => {
    const valid = sqlFunctionSchema.safeParse(functionExample)
    expect(valid.success).toBe(true)
  })
})

describe('sqlifyFunction', () => {
  it('should return round(colorId)', () => {
    expect(sqlifyFunction(functionExample)).toBe('round(colorId)')
  })
})
