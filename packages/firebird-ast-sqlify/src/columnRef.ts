import { z } from 'zod'

export const columnRefSchema = z.object({
  type: z.literal('column_ref'),
  table: z.union([z.string().nullable(), z.object({ type: z.literal('backticks_quote_string'), value: z.string() })]),
  column: z.string(),
})

export type ColumnRef = z.infer<typeof columnRefSchema>

export const sqlifyColumnRef = (columnRef: ColumnRef): string => {
  const table = columnRef.table
    ? typeof columnRef.table === 'string'
      ? `${columnRef.table}.`
      : `${columnRef.table.value}.`
    : ''
  return `${table}${columnRef.column}`
}
