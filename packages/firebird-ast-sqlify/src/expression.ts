import { z } from 'zod'
import { columnRefSchema, sqlifyColumnRef } from './columnRef'
import { sqlifyValue, valueSchema } from './value'
import { sqlFunctionSchema, sqlifyFunction } from './sqlFunction'
import { exhaustiveCheck } from './utils'
import { getArgumentsCountInSelect, selectSchema, sqlifySelect } from './select'

const subquerySelectSchema = z.object({ ast: z.lazy(() => selectSchema) })

export const expressionSchema = z.union([columnRefSchema, valueSchema, sqlFunctionSchema, subquerySelectSchema])

export type Expression = z.infer<typeof expressionSchema>

export const expressionListSchema = z.object({
  type: z.literal('expr_list'),
  value: z.array(expressionSchema),
})

export type ExpressionList = z.infer<typeof expressionListSchema>

export const sqlifyExpression = (ast: Expression): string => {
  if ('ast' in ast) {
    return `${sqlifySelect(ast.ast)}`
  }
  if (!('type' in ast)) return ''

  switch (ast.type) {
    case 'column_ref':
      return sqlifyColumnRef(ast)
    case 'number':
    case 'single_quote_string':
    case 'origin':
    case 'null':
      return sqlifyValue(ast)
    case 'function':
      return sqlifyFunction(ast)
    default: {
      return exhaustiveCheck(ast)
    }
  }
}

export const sqlifyExpressionList = (ast: ExpressionList): string => {
  const list = ast.value.map((v) => sqlifyExpression(v)).join(', ')
  return `(${list})`
}

export const getArgumentCountInExpression = (ast: Expression): number => {
  if ('ast' in ast) {
    return getArgumentsCountInSelect(ast.ast)
  }
  if (!('type' in ast)) return 0

  switch (ast.type) {
    case 'column_ref':
    case 'number':
    case 'single_quote_string':
    case 'null':
      return 0
    case 'origin':
      return ast.value === '?' ? 1 : 0
    case undefined:
      return 0
    case 'function':
      return ast.args.value.reduce((acc, astElement) => {
        return acc + getArgumentCountInExpression(astElement)
      }, 0)

    default:
      return exhaustiveCheck(ast)
  }
}

export const getArgumentCountInExpressionList = (ast: ExpressionList): number => {
  return ast.value.reduce((acc, astElement) => {
    return acc + getArgumentCountInExpression(astElement)
  }, 0)
}
