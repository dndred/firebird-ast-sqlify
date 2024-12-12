import { exhaustiveCheck } from './utils'
import { z } from 'zod'

export const valueScalarSchema = z.union([
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
  z.object({
    type: z.literal('null'),
    value: z.literal(null),
  }),
])

export const valueListSchema = z.array(valueScalarSchema)

export const valueSchema = z.union([valueScalarSchema, valueListSchema])

export type Value = z.infer<typeof valueSchema>

export const sqlifyValue = (value: Value): string => {
  if ('length' in value) {
    return `(${value.map(sqlifyValue).join(', ')})`
  }

  switch (value.type) {
    case 'number':
      return value.value.toString()
    case 'single_quote_string':
      return `'${value.value}'`
    case 'origin':
      return value.value
    case 'null':
      return 'NULL'
    default:
      return exhaustiveCheck(value)
  }
}
