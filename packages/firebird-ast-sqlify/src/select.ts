import { sqlifyWhere, whereSchema } from './where'
import { z } from 'zod'
import { columnRefSchema } from './columnRef'
import { limitSchema, sqlifyLimit } from './limit'
import { sqlifyTableName, tableNameSchema } from './table-name'
import { valueSchema } from './value'
import { sqlifySelectColumn } from './selectColumn'

export const selectSchema = z.object({
  type: z.literal('select'),
  columns: z.array(
    z.object({
      expr: z.union([columnRefSchema, valueSchema]),
      as: z.string().nullable(),
    }),
  ),
  from: z.array(tableNameSchema),
  where: whereSchema.nullable(),
  limit: limitSchema.nullable(),
})

type Select = z.infer<typeof selectSchema>

export const sqlifySelect = (ast: Select) => {
  const columns = ast.columns.map(sqlifySelectColumn).join(', ')
  const from = ast.from.map(sqlifyTableName).join(', ')
  const where = ast.where ? `where ${sqlifyWhere(ast.where)}` : ''
  const limit = ast.limit ? ` ${sqlifyLimit(ast.limit)}` : ''

  return `SELECT${limit} ${columns} FROM ${from} ${where}`.trim()
}
