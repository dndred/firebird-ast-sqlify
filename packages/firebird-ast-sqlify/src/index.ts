import { Ast, astSchema } from './ast-schema'
import { sqlifySelect } from './select'
import { Parser } from 'node-sql-parser'
import { exhaustiveCheck } from './utils'
import { sqlifyInsert } from './insert'

export const sqlify = (ast: Ast): string => {
  switch (ast.type) {
    case 'select':
      return sqlifySelect(ast)
    case 'insert':
      return sqlifyInsert(ast)
    default:
      return exhaustiveCheck(ast)
  }
}

export const convertSqlToFirebird = (sql: string): string => {
  const parser = new Parser()
  const ast = parser.astify(sql, {
    database: 'MySQL',
  })
  const parsedSchema = astSchema.parse(ast)
  return sqlify(parsedSchema)
}
