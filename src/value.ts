import { exhaustiveCheck } from './utils'
import { z } from 'zod'

export const valueSchema = z.union([
  z.object({
    type: z.literal('single_quote_string'),
    value: z.string(),
  }),
  z.object({
    type: z.literal('number'),
    value: z.number(),
  }),
  z.object({
    type: z.literal('origin'),
    value: z.string(),
  }),
])

export type Value = z.infer<typeof valueSchema>

export const sqlifyValue = (value: Value): string => {
  switch (value.type) {
    case 'number':
      return value.value.toString()
    case 'single_quote_string':
      return `'${value.value}'`
    case 'origin':
      return value.value
    default:
      return exhaustiveCheck(value)
  }
}
