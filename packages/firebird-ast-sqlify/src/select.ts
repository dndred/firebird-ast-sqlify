import { getArgumentsCountInWhere, sqlifyWhere, whereSchema } from './where'
import { z } from 'zod'
import { columnRefSchema } from './columnRef'
import { getArgumentsCountInLimit, limitSchema, sqlifyLimit } from './limit'
import { sqlifyFrom, fromSchema } from './from'
import { valueSchema } from './value'
import { sqlifySelectColumn } from './selectColumn'

export const selectSchema = z.object({
  type: z.literal('select'),
  columns: z.array(
    z.object({
      expr: z.union([columnRefSchema, valueSchema]),
      as: z.string().nullable(),
    }),
  ),
  from: z.array(fromSchema),
  where: whereSchema.nullable(),
  limit: limitSchema.nullable(),
})

type Select = z.infer<typeof selectSchema>

export const getArgumentsCountInSelect = (ast: Select): number => {
  return getArgumentsCountInWhere(ast.where) + getArgumentsCountInLimit(ast.limit)
}

export const reorderSelectQueryArguments = (ast: Select, args: unknown[]): unknown[] => {
  const argumentsInWhere = getArgumentsCountInWhere(ast.where)
  const argumentsInLimit = getArgumentsCountInLimit(ast.limit)
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
