import { ExpressionList, expressionListSchema, sqlifyExpressionList } from './expression'
import { describe, expect, it } from 'bun:test'

// (1)
const expressionListExample: ExpressionList = {
  type: 'expr_list',
  value: [
    {
      type: 'number',
      value: 1,
    },
  ],
}

// (1, 2)
const expressionListTwoConstsExample: ExpressionList = {
  type: 'expr_list',
  value: [
    {
      type: 'number',
      value: 1,
    },
    {
      type: 'number',
      value: 2,
    },
  ],
}

const expressionListWithArgumentExample: ExpressionList = {
  type: 'expr_list',
  value: [
    {
      type: 'origin',
      value: '?',
    },
    {
      type: 'single_quote_string',
      value: 'red',
    },
  ],
}

const expressionListWithSelectExample: ExpressionList = {
  type: 'expr_list',
  value: [
    {
      ast: {
        type: 'select',
        columns: [
          {
            expr: {
              type: 'column_ref',
              table: 'table2',
              column: 'id',
            },
            as: null,
          },
        ],
        from: [
          {
            db: null,
            table: 'table2',
            as: null,
          },
        ],
        where: null,
        orderby: null,
        limit: null,
      },
    },
  ],
}

describe('should validate expressionList schema', () => {
  it('should validate expressionList (1)', () => {
    const valid = expressionListSchema.safeParse(expressionListExample)
    expect(valid.success).toBe(true)
  })

  it('should validate expressionList (1, 2)', () => {
    const valid = expressionListSchema.safeParse(expressionListTwoConstsExample)
    expect(valid.success).toBe(true)
  })

  it("should validate expressionList (?, 'red')", () => {
    const valid = expressionListSchema.safeParse(expressionListWithArgumentExample)
    expect(valid.success).toBe(true)
  })

  it('should validate expressionList with select', () => {
    const valid = expressionListSchema.safeParse(expressionListWithSelectExample)
    console.log(valid.error)

    expect(valid.success).toBe(true)
  })
})

describe('should sqlifyExpressionList', () => {
  it('should return (1)', () => {
    expect(sqlifyExpressionList(expressionListExample)).toBe('(1)')
  })

  it('should return (1, 2)', () => {
    expect(sqlifyExpressionList(expressionListTwoConstsExample)).toBe('(1, 2)')
  })

  it("should return (?, 'red')", () => {
    expect(sqlifyExpressionList(expressionListWithArgumentExample)).toBe("(?, 'red')")
  })

  it('should return (select table2.id from table2)', () => {
    expect(sqlifyExpressionList(expressionListWithSelectExample)).toBe('(SELECT table2.id FROM table2)')
  })
})
