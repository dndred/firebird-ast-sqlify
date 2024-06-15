import { exhaustiveCheck } from './utils'
import { sqlifyValue, Value, valueSchema } from './value'
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
  ]),
  parentheses: z.boolean().optional(),
})

export type Where = z.infer<typeof baseBinaryExprSchema> & {
  left: ColumnRef | Value | Where
  right: ColumnRef | Value | Where
}

export const whereSchema: z.ZodType<Where> = baseBinaryExprSchema.extend({
  left: z.lazy(() => z.union([columnRefSchema, valueSchema, whereSchema])),
  right: z.lazy(() => z.union([columnRefSchema, valueSchema, whereSchema])),
})

const ExpressionSchema = z.union([columnRefSchema, valueSchema, whereSchema])

type BinaryExpressionSide = z.infer<typeof ExpressionSchema>

const sqlifyBinaryExpressionSide = (ast: BinaryExpressionSide): string => {
  switch (ast.type) {
    case 'column_ref':
      return sqlifyColumnRef(ast)
    case 'number':
      return sqlifyValue(ast)
    case 'single_quote_string':
      return sqlifyValue(ast)
    case 'origin':
      return sqlifyValue(ast)
    case 'binary_expr':
      return sqlifyWhere(ast)
    default:
      return exhaustiveCheck(ast)
  }
}

export const sqlifyWhere = (ast: Where): string => {
  if (ast.type !== 'binary_expr') {
    return exhaustiveCheck(ast.type)
  }
  const left = sqlifyBinaryExpressionSide(ast.left)
  const right = sqlifyBinaryExpressionSide(ast.right)
  const s = `${left} ${ast.operator} ${right}`
  if (ast.parentheses) {
    return `(${s})`
  }
  return s
}

const getArgumentCountInBinaryExpressionSide = (ast: BinaryExpressionSide): number => {
  switch (ast.type) {
    case 'column_ref':
      return 0
    case 'number':
      return 0
    case 'single_quote_string':
      return 0
    case 'origin':
      return ast.value === '?' ? 1 : 0
    case 'binary_expr':
      return getArgumentsCountInWhere(ast)
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
