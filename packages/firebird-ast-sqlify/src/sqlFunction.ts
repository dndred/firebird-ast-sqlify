import { z } from 'zod'
import { columnRefSchema } from './columnRef'
import { valueSchema } from './value'
import { sqlifyBinaryExpressionSide } from './where'

export const sqlFunctionSchema = z.object({
  type: z.literal('function'),
  name: z.object({
    name: z.array(
      z.object({
        type: z.literal('default'),
        value: z.string(),
      }),
    ),
  }),
  args: z.object({
    type: z.literal('expr_list'),
    value: z.array(z.union([columnRefSchema, valueSchema])),
  }),
  over: z.unknown().nullable(),
})

export type SqlFunction = z.infer<typeof sqlFunctionSchema>

export const sqlifyFunction = (func: SqlFunction): string => {
  const name = func.name.name.map((name) => name.value).join('.')
  const args = func.args.value.map(sqlifyBinaryExpressionSide)

  return `${name}(${args.join(', ')})`
}
