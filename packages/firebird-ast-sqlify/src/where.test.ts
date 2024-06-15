import { getArgumentsCountInWhere, Where, whereSchema } from './where'
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

const whereWithArgument: Where = {
  type: 'binary_expr',
  operator: '=',
  left: {
    type: 'column_ref',
    table: null,
    column: 'id',
  },
  right: {
    type: 'origin',
    value: '?',
  },
}

const whereWithArgumentsOnBothSided: Where = {
  type: 'binary_expr',
  operator: '=',
  left: {
    type: 'origin',
    value: '?',
  },
  right: {
    type: 'origin',
    value: '?',
  },
}

// where (id = ? or id = ?) and colorname <> ?
const whereWithArgumentsOrAndAnd: Where = {
  type: 'binary_expr',
  operator: 'AND',
  left: {
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
        type: 'origin',
        value: '?',
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
        type: 'origin',
        value: '?',
      },
    },
    parentheses: true,
  },
  right: {
    type: 'binary_expr',
    operator: '<>',
    left: {
      type: 'column_ref',
      table: null,
      column: 'colorname',
    },
    right: {
      type: 'origin',
      value: '?',
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

  it('should validate where with argument', () => {
    const valid = whereSchema.safeParse(whereWithArgument)
    expect(valid.success).toBe(true)
  })

  it('should validate where with argument and OR and AND', () => {
    const valid = whereSchema.safeParse(whereWithArgumentsOrAndAnd)
    expect(valid.success).toBe(true)
  })
})

describe('get argument count from where', () => {
  it('without arguments', () => {
    expect(getArgumentsCountInWhere(whereExampleWithAnd)).toBe(0)
  })

  it('without arguments', () => {
    expect(getArgumentsCountInWhere(whereWithArgument)).toBe(1)
  })

  it('with arguments on both sided', () => {
    expect(getArgumentsCountInWhere(whereWithArgumentsOnBothSided)).toBe(2)
  })

  it('with arguments and OR and AND', () => {
    expect(getArgumentsCountInWhere(whereWithArgumentsOrAndAnd)).toBe(3)
  })
})
