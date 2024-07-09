import { z } from 'zod'
import { sqlifyWhere, whereSchema } from './where'

export const fromSchema = z.object({
  db: z.string().nullable(),
  table: z.string(),
  as: z.string().nullish(),
  join: z.union([z.literal('LEFT JOIN'), z.literal('RIGHT JOIN')]).optional(),
  on: whereSchema.optional(),
})

export type From = z.infer<typeof fromSchema>

export const sqlifyFrom = (from: From): string => {
  const as = from.as ? ` as ${from.as}` : ''
  const on = !from.on ? '' : `ON ${sqlifyWhere(from.on)}`
  return `${from.join ?? ''} ${from.table}${as} ${on}`.trim()
}
