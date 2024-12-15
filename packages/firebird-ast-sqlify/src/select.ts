import { getArgumentsCountInWhere, sqlifyWhere, whereSchema } from './where'
import { z } from 'zod'
import { columnRefSchema } from './columnRef'
import { getArgumentsCountInLimit, limitSchema, sqlifyLimit } from './limit'
import { sqlifyFrom, fromSchema } from './from'
import { valueSchema } from './value'
import { sqlifySelectColumn } from './selectColumn'
import { sqlFunctionSchema } from './sqlFunction'

export const selectSchema = z.object({
  type: z.literal('select'),
  columns: z.array(
    z.object({
      expr: z.union([columnRefSchema, valueSchema, sqlFunctionSchema]),
      as: z.string().nullable(),
    }),
  ),
  from: z.array(fromSchema),
  where: whereSchema.nullable(),
  limit: limitSchema.nullable(),
})

type Select = z.infer<typeof selectSchema>

export const getArgumentsCountInSelect = (ast: Select): number => {
  const inWhere = ast.where ? getArgumentsCountInWhere(ast.where) : 0
  const inLimit = ast.limit ? getArgumentsCountInLimit(ast.limit) : 0
  return inWhere + inLimit
}

export const reorderSelectQueryArguments = (ast: Select, args: unknown[]): unknown[] => {
  const argumentsInWhere = ast.where ? getArgumentsCountInWhere(ast.where) : 0
  const argumentsInLimit = ast.limit ? getArgumentsCountInLimit(ast.limit) : 0
  if (!argumentsInLimit || !argumentsInWhere) return args
  const limitArguments = args.slice(args.length - argumentsInLimit)
  const whereArguments = args.slice(0, args.length - argumentsInLimit)

  return [...limitArguments, ...whereArguments]
}

export const sqlifySelect = (ast: Select) => {
  const columns = ast.columns.map(sqlifySelectColumn).join(', ')
  const from = ast.from.map(sqlifyFrom).join('\n')
  const where = ast.where ? `where ${sqlifyWhere(ast.where)}` : ''
  const limit = ast.limit ? ` ${sqlifyLimit(ast.limit)}` : ''

  return `SELECT${limit} ${columns} FROM ${from} ${where}`.trim()
}
