import { z } from 'zod'
import { sqlifyExpression } from './expression'
import { columnRefSchema } from './columnRef'

const orderByItemSchema = z.object({
  expr: columnRefSchema,
  type: z.union([z.literal('ASC'), z.literal('DESC')]).nullable(),
})

export const orderBySchema = z.array(orderByItemSchema)

export type OrderBy = z.infer<typeof orderBySchema>

export const sqlifyOrderBy = (ast: OrderBy): string => {
  return ast
    .map((orderBy) => {
      const direction = orderBy.type === null ? '' : `${orderBy.type}`
      return `${sqlifyExpression(orderBy.expr)} ${direction}`.trim()
    })
    .join(', ')
}
