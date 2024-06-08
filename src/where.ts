import { exhaustiveCheck } from './utils'
import { sqlifyValue, valueSchema } from './value'
import { z } from 'zod'
import { columnRefSchema, sqlifyColumnRef } from './columnRef'

export const whereSchema = z.object({
  type: z.literal('binary_expr'),
  operator: z.union([
    z.literal('='),
    z.literal('>'),
    z.literal('<'),
    z.literal('<>'),
    z.literal('>='),
    z.literal('<='),
    z.literal('<='),
  ]),
  left: z.union([columnRefSchema, valueSchema]),
  right: z.union([columnRefSchema, valueSchema]),
})

export type Where = z.infer<typeof whereSchema>

export const sqlifyWhere = (ast: Where): string => {
  if (ast.type !== 'binary_expr') {
    return exhaustiveCheck(ast.type)
  }
  const left = ast.left.type === 'column_ref' ? sqlifyColumnRef(ast.left) : sqlifyValue(ast.left)
  const right = ast.right.type === 'column_ref' ? sqlifyColumnRef(ast.right) : sqlifyValue(ast.right)
  return `${left} ${ast.operator} ${right}`
}
