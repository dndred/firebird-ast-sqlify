import { z } from 'zod'
import { columnRefSchema, sqlifyColumnRef } from './columnRef'
import { sqlifyValue, valueSchema } from './value'
import { exhaustiveCheck } from './utils'

export const selectColumnSchema = z.object({
  expr: z.union([columnRefSchema, valueSchema]),
  as: z.string().nullable(),
})

export type SelectColumn = z.infer<typeof selectColumnSchema>

const sqlifySelectColumnValue = (column: SelectColumn): string => {
  switch (column.expr.type) {
    case 'column_ref':
      return sqlifyColumnRef(column.expr)
    case 'number':
    case 'origin':
    case 'single_quote_string':
      return sqlifyValue(column.expr)
    default:
      return exhaustiveCheck(column.expr)
  }
}

export const sqlifySelectColumn = (column: SelectColumn): string => {
  const value = sqlifySelectColumnValue(column)
  const as = column.as ? ` as ${column.as}` : ''
  return `${value}${as}`
}
