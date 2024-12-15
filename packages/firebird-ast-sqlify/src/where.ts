import { Value, valueSchema } from './value'
import { z } from 'zod'
import { ColumnRef, columnRefSchema } from './columnRef'
import {
  ExpressionList,
  expressionListSchema,
  expressionSchema,
  getArgumentCountInExpression,
  getArgumentCountInExpressionList,
  sqlifyExpression,
  sqlifyExpressionList,
} from './expression'

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

export type Where = z.infer<typeof baseBinaryExprSchema> & {
  left: ColumnRef | Value | Where
  right: ColumnRef | Value | Where | ExpressionList
}

// @ts-expect-error ???
export const whereSchema: z.ZodType<Where> = baseBinaryExprSchema.extend({
  left: z.lazy(() => z.union([columnRefSchema, valueSchema, whereSchema])),
  right: z.lazy(() => z.union([columnRefSchema, valueSchema, whereSchema, expressionListSchema])),
})

const ExpressionSchemaLeftSide = z.union([expressionSchema, whereSchema])
type BinaryExpressionLeftSide = z.infer<typeof ExpressionSchemaLeftSide>

const ExpressionSchemaRightSide = z.union([expressionSchema, whereSchema, expressionListSchema])
type BinaryExpressionRightSide = z.infer<typeof ExpressionSchemaRightSide>

export const sqlifyBinaryExpressionSide = (ast: BinaryExpressionLeftSide | BinaryExpressionRightSide): string => {
  if (!('type' in ast)) return ''
  switch (ast.type) {
    case 'binary_expr':
      return sqlifyWhere(ast)
    case 'expr_list':
      return sqlifyExpressionList(ast)
    default:
      return sqlifyExpression(ast)
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
  if (!('type' in ast)) return 0

  switch (ast.type) {
    case 'binary_expr':
      return getArgumentsCountInWhere(ast)
    case 'expr_list':
      return getArgumentCountInExpressionList(ast)
    default:
      return getArgumentCountInExpression(ast)
  }
}

export const getArgumentsCountInWhere = (ast: Where): number => {
  const left = getArgumentCountInBinaryExpressionSide(ast.left)
  const right = getArgumentCountInBinaryExpressionSide(ast.right)

  return left + right
}
