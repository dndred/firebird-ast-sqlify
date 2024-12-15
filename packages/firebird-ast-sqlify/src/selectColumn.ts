import { z } from 'zod'
import { columnRefSchema, sqlifyColumnRef } from './columnRef'
import { sqlifyValue, valueSchema } from './value'
import { exhaustiveCheck } from './utils'
import { sqlFunctionSchema, sqlifyFunction } from './sqlFunction'

export const selectColumnSchema = z.object({
  expr: z.union([columnRefSchema, valueSchema, sqlFunctionSchema]),
  as: z.string().nullable(),
})

export type SelectColumn = z.infer<typeof selectColumnSchema>

const sqlifySelectColumnValue = (column: SelectColumn): string => {
  const expr = column.expr
  if (!('type' in expr)) {
    return ''
  }

  switch (expr.type) {
    case 'column_ref':
      return sqlifyColumnRef(expr)
    case 'number':
    case 'origin':
    case 'single_quote_string':
      return sqlifyValue(expr)
    case 'function':
      return sqlifyFunction(expr)
    case 'null':
      return ''
    default:
      return exhaustiveCheck(expr)
  }
}

export const sqlifySelectColumn = (column: SelectColumn): string => {
  const value = sqlifySelectColumnValue(column)
  const as = column.as ? ` as ${column.as}` : ''
  return `${value}${as}`
}
