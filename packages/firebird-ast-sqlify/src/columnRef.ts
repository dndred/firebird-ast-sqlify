import { z } from 'zod'

export const columnRefSchema = z.object({
  type: z.literal('column_ref'),
  table: z.string().nullable(),
  column: z.string(),
})

export type ColumnRef = z.infer<typeof columnRefSchema>

export const sqlifyColumnRef = (columnRef: ColumnRef): string => {
  const table = columnRef.table ? `${columnRef.table}.` : ''
  return `${table}${columnRef.column}`
}
