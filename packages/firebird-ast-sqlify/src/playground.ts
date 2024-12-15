import { Parser } from 'node-sql-parser'
import { convertSqlToFirebird, sqlify } from './index'
import { astSchema } from './ast-schema'

const sql = 'SELECT id FROM table1 ORDER BY field1, field2 desc, field3 asc'
const parser = new Parser()
const ast = parser.astify(sql, {
  database: 'MySQL',
})
console.log(JSON.stringify(ast, null, 2))
const { success, data } = astSchema.safeParse(ast)
if (success) {
  console.log(sqlify(data))
  console.log(convertSqlToFirebird(sql))
} else {
  console.error('Invalid AST!')
}
