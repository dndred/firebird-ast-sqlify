import { Parser } from 'node-sql-parser'
import { sqlify } from './index'
import { astSchema } from './ast-schema'

const sql = 'SELECT id FROM table1 WHERE id IN (SELECT table2.id FROM table2)'
const parser = new Parser()
const ast = parser.astify(sql, {
  database: 'MySQL',
})
console.log(JSON.stringify(ast, null, 2))
const { success, data } = astSchema.safeParse(ast)
if (success) {
  console.log(sqlify(data))
} else {
  console.error('Invalid AST!')
}
