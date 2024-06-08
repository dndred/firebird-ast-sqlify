import { z } from 'zod'
import { valueSchema } from './value'
import { describe, expect, it } from 'bun:test'
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

type Limit = z.infer<typeof limitSchema>

export const sqlifyLimit = (ast: Limit): string => {
  if (ast.seperator === '') {
    return `first ${ast.value[0].value}`
  } else if (ast.seperator === 'offset') {
    return `first ${ast.value[0].value} skip ${ast.value[1].value}`
  }

  return exhaustiveCheck(ast)
}

const limitExample: Limit = {
  seperator: '',
  value: [
    {
      type: 'number',
      value: 10,
    },
  ],
} as const

const limitWithOffsetExample: Limit = {
  seperator: 'offset',
  value: [
    {
      type: 'number',
      value: 10,
    },
    {
      type: 'number',
      value: 5,
    },
  ],
} as const

describe('limitSchema', () => {
  it('should validate limit', () => {
    const valid = limitSchema.safeParse(limitExample)
    expect(valid.success).toBe(true)
  })

  it('should validate limit with offset', () => {
    const valid = limitSchema.safeParse(limitWithOffsetExample)
    expect(valid.success).toBe(true)
  })
})

describe('sqlifyLimit', () => {
  it('should convert limit', () => {
    expect(sqlifyLimit(limitExample)).toBe('first 10')
  })

  it('should convert limit with offset', () => {
    expect(sqlifyLimit(limitWithOffsetExample)).toBe('first 10 skip 5')
  })
})
