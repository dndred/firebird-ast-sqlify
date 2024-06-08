import { z } from 'zod'

export const tableNameSchema = z.object({
  db: z.string().nullable(),
  table: z.string(),
  as: z.string().nullish(),
})

export type TableName = z.infer<typeof tableNameSchema>

export const sqlifyTableName = (tableName: TableName): string => {
  const as = tableName.as ? ` as ${tableName.as}` : ''
  return `${tableName.table}${as}`
}
