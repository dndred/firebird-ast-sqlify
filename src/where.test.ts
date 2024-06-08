import { Where, whereSchema } from './where'
import { describe, expect, it } from 'bun:test'

const whereExample: Where = {
  type: 'binary_expr',
  operator: '=',
  left: {
    type: 'column_ref',
    table: null,
    column: 'id',
  },
  right: {
    type: 'number',
    value: 1,
  },
}

const whereExampleWithParentheses: Where = {
  type: 'binary_expr',
  operator: 'AND',
  left: {
    type: 'binary_expr',
    operator: '=',
    left: {
      type: 'column_ref',
      table: null,
      column: 'id',
    },
    right: {
      type: 'number',
      value: 1,
    },
  },
  right: {
    type: 'binary_expr',
    operator: '=',
    left: {
      type: 'column_ref',
      table: null,
      column: 'colorname',
    },
    right: {
      type: 'single_quote_string',
      value: 'red',
    },
  },
  parentheses: true,
}

const whereExampleWithAnd: Where = {
  type: 'binary_expr',
  operator: 'AND',
  left: {
    type: 'binary_expr',
    operator: '=',
    left: {
      type: 'column_ref',
      table: null,
      column: 'id',
    },
    right: {
      type: 'number',
      value: 1,
    },
  },
  right: {
    type: 'binary_expr',
    operator: '=',
    left: {
      type: 'column_ref',
      table: null,
      column: 'COLORNAME',
    },
    right: {
      type: 'single_quote_string',
      value: 'red',
    },
  },
}

const whereExampleWithOr: Where = {
  type: 'binary_expr',
  operator: 'OR',
  left: {
    type: 'binary_expr',
    operator: '=',
    left: {
      type: 'column_ref',
      table: null,
      column: 'id',
    },
    right: {
      type: 'number',
      value: 1,
    },
  },
  right: {
    type: 'binary_expr',
    operator: '=',
    left: {
      type: 'column_ref',
      table: null,
      column: 'id',
    },
    right: {
      type: 'number',
      value: 2,
    },
  },
}

describe('whereSchema', () => {
  it('should validate where', () => {
    const valid = whereSchema.safeParse(whereExample)
    expect(valid.success).toBe(true)
  })
  it('should validate where with parentheses', () => {
    const valid = whereSchema.safeParse(whereExampleWithParentheses)
    expect(valid.success).toBe(true)
  })

  it('should validate where with AND', () => {
    const valid = whereSchema.safeParse(whereExampleWithAnd)
    expect(valid.success).toBe(true)
  })

  it('should validate where with OR', () => {
    const valid = whereSchema.safeParse(whereExampleWithOr)
    expect(valid.success).toBe(true)
  })
})
