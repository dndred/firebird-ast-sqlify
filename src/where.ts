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

const BinaryExpressionSideSchema = z.union([columnRefSchema, valueSchema, whereSchema])

type BinaryExpressionSide = z.infer<typeof BinaryExpressionSideSchema>

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
