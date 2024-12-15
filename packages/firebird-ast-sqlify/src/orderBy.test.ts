import { describe, expect, it } from 'bun:test'
import { OrderBy, orderBySchema, sqlifyOrderBy } from './orderBy'

// ORDER BY field1, field2 desc, field3 asc
const orderByExample: OrderBy = [
  {
    expr: {
      type: 'column_ref',
      table: null,
      column: 'field1',
    },
    type: null,
  },
  {
    expr: {
      type: 'column_ref',
      table: null,
      column: 'field2',
    },
    type: 'DESC',
  },
  {
    expr: {
      type: 'column_ref',
      table: null,
      column: 'field3',
    },
    type: 'ASC',
  },
]

describe('orderBy schema', () => {
  it('should validate', () => {
    const valid = orderBySchema.safeParse(orderByExample)
    expect(valid.success).toBe(true)
  })
})

describe('sqlifyOrderBy', () => {
  it('should return field1, field2 DESC, field3 ASC', () => {
    expect(sqlifyOrderBy(orderByExample)).toBe('field1, field2 DESC, field3 ASC')
  })
})
