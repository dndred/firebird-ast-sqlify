import { exhaustiveCheck } from './utils'
import { z } from 'zod'
import { sqlifyValue, valueSchema } from './value'

export const insertSchema = z.object({
  type: z.literal('insert'),
  table: z.array(
    z.object({
      db: z.string().nullable(),
      table: z.string(),
      as: z.string().nullable(),
    }),
  ),
  columns: z.array(z.string()),
  values: z.array(
    z.object({
      type: z.literal('expr_list'),
      value: z.array(valueSchema),
    }),
  ),
  partition: z.string().nullable(),
  prefix: z.literal('into'),
})

type Insert = z.infer<typeof insertSchema>

export const sqlifyInsert = (ast: Insert) => {
  const table = ast.table[0].table
  const columns = ast.columns.join(', ')
  const values = ast.values
    .map((value) => {
      if (value.type === 'expr_list') {
        return value.value.map((v) => sqlifyValue(v)).join(', ')
      } else {
        return exhaustiveCheck(value.type)
      }
    })
    .join(', ')
  return `insert into ${table} (${columns}) values (${values})`
}
