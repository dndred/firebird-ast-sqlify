import { z } from 'zod'
import { valueSchema } from './value'
import { exhaustiveCheck } from './utils'

export const limitSchema = z.union([
  z.object({
    seperator: z.literal(''),
    value: z.array(valueSchema).length(1),
  }),
  z.object({
    seperator: z.literal('offset'),
    value: z.array(valueSchema).length(2),
  }),
])

export type Limit = z.infer<typeof limitSchema>

export const sqlifyLimit = (ast: Limit): string => {
  if (ast.seperator === '') {
    return `first ${ast.value[0].value}`
  } else if (ast.seperator === 'offset') {
    return `first ${ast.value[0].value} skip ${ast.value[1].value}`
  }

  return exhaustiveCheck(ast)
}
