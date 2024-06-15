import { describe, expect, it } from 'bun:test'
import {getArgumentsCountInLimit, Limit, limitSchema, sqlifyLimit} from './limit'

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


const limitWithArgumentExample: Limit = {
  "seperator": "",
  "value": [
    {
      "type": "origin",
      "value": "?"
    }
  ]
}

const limitWithArgumentAndOffset: Limit = {
    "seperator": "offset",
    "value": [
      {
        "type": "origin",
        "value": "?"
      },
      {
        "type": "origin",
        "value": "?"
      }
    ]
  }

describe('limitSchema', () => {
  it('should validate limit', () => {
    const valid = limitSchema.safeParse(limitExample)
    expect(valid.success).toBe(true)
  })

  it('should validate limit with offset', () => {
    const valid = limitSchema.safeParse(limitWithOffsetExample)
    expect(valid.success).toBe(true)
  })

  it('should validate limit with argument', () => {
    const valid = limitSchema.safeParse(limitWithArgumentExample)
    expect(valid.success).toBe(true)
  })

  it('should validate limit and offset with argument', () => {
    const valid = limitSchema.safeParse(limitWithArgumentAndOffset)
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

describe('getArgumentsCountInLimit', () => {
  it('limit without argument', () => {
    expect(getArgumentsCountInLimit(limitWithOffsetExample)).toBe(0)
  })

  it('limit with argument', () => {
    expect(getArgumentsCountInLimit(limitWithArgumentExample)).toBe(1)
  })

  it('limit with offset and arguments', () => {
    expect(getArgumentsCountInLimit(limitWithArgumentAndOffset)).toBe(2)
  })
})
