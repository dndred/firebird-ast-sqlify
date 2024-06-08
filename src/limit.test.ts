import { describe, expect, it } from 'bun:test'
import { Limit, limitSchema, sqlifyLimit } from './limit'

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
