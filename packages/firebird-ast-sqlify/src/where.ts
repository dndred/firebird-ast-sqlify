import { exhaustiveCheck } from './utils'
import { sqlifyValue, Value, valueScalarSchema, valueSchema } from './value'
import { z } from 'zod'
import { ColumnRef, columnRefSchema, sqlifyColumnRef } from './columnRef'

const baseBinaryExprSchema = z.object({
  type: z.literal('binary_expr'),
  operator: z.union([
    z.literal('='),
    z.literal('>'),
    z.literal('<'),
    z.literal('<>'),
    z.literal('>='),
    z.literal('<='),
    z.literal('<='),
    z.literal('AND'),
    z.literal('OR'),
    z.literal('IS'),
    z.literal('IS NOT'),
    z.literal('IN'),
  ]),
  parentheses: z.boolean().optional(),
})

const expressionListSchema = z.object({
  type: z.literal('expr_list'),
  value: z.array(valueScalarSchema),
})

type ExpressionList = z.infer<typeof expressionListSchema>

export type Where = z.infer<typeof baseBinaryExprSchema> & {
  left: ColumnRef | Value | Where
  right: ColumnRef | Value | Where | ExpressionList
}

// @ts-expect-error ???
export const whereSchema: z.ZodType<Where> = baseBinaryExprSchema.extend({
  left: z.lazy(() => z.union([columnRefSchema, valueSchema, whereSchema])),
  right: z.lazy(() => z.union([columnRefSchema, valueSchema, whereSchema, expressionListSchema])),
})

const ExpressionSchemaLeftSide = z.union([columnRefSchema, valueSchema, whereSchema])
type BinaryExpressionLeftSide = z.infer<typeof ExpressionSchemaLeftSide>

const ExpressionSchemaRightSide = z.union([columnRefSchema, valueSchema, whereSchema, expressionListSchema])
type BinaryExpressionRightSide = z.infer<typeof ExpressionSchemaRightSide>

const sqlifyBinaryExpressionSide = (ast: BinaryExpressionLeftSide | BinaryExpressionRightSide): string => {
  if ('length' in ast) {
    return sqlifyValue(ast)
  }
  switch (ast.type) {
    case 'column_ref':
      return sqlifyColumnRef(ast)
    case 'number':
    case 'single_quote_string':
    case 'origin':
    case 'null':
      return sqlifyValue(ast)
    case 'binary_expr':
      return sqlifyWhere(ast)
    case 'expr_list':
      return ast.value.map((v) => sqlifyValue(v)).join(', ')
    default:
      return exhaustiveCheck(ast)
  }
}

export const sqlifyWhere = (ast?: Where): string => {
  if (!ast) return ''

  switch (ast.type) {
    case 'binary_expr': {
      const left = sqlifyBinaryExpressionSide(ast.left)
      const right = sqlifyBinaryExpressionSide(ast.right)
      const s = `${left} ${ast.operator} ${right}`
      if (ast.parentheses) {
        return `(${s})`
      }
      return s
    }
  }
}

const getArgumentCountInBinaryExpressionSide = (ast: BinaryExpressionLeftSide | BinaryExpressionRightSide): number => {
  if ('length' in ast) {
    return ast.reduce((acc, astElement) => {
      return acc + getArgumentCountInBinaryExpressionSide(astElement)
    }, 0)
  }
  switch (ast.type) {
    case 'column_ref':
    case 'number':
    case 'single_quote_string':
    case 'null':
      return 0
    case 'origin':
      return ast.value === '?' ? 1 : 0
    case 'binary_expr':
      return getArgumentsCountInWhere(ast)
    case 'expr_list':
      return getArgumentCountInBinaryExpressionSide(ast.value)
    case undefined:
      return 0
    default:
      return exhaustiveCheck(ast)
  }
}

export const getArgumentsCountInWhere = (ast?: Where): number => {
  if (!ast) return 0
  if (ast.type !== 'binary_expr') {
    return exhaustiveCheck(ast.type)
  }

  const left = getArgumentCountInBinaryExpressionSide(ast.left)
  const right = getArgumentCountInBinaryExpressionSide(ast.right)

  return left + right
}
