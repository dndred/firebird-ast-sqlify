import { Parser } from 'node-sql-parser'
import { sqlify } from './index'
import { astSchema } from './ast-schema'

const sql = `select c.id as colorId, 1 as id from colors where c.id = 1`
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
