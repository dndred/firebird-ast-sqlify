import { Parser } from 'node-sql-parser'
import { sqlify } from './index'
import { astSchema } from './ast-schema'

const sql =
  'SELECT `mysql`.`colors`.`colorid`, `mysql`.`colors`.`colorname` FROM `mysql`.`colors` WHERE 1=1 LIMIT ? OFFSET ?'
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
