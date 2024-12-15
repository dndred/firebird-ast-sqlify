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

describe('should validate expressionList schema', () => {
  it('should validate expressionList (1)', () => {
    const valid = expressionListSchema.safeParse(expressionListExample)
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
})
