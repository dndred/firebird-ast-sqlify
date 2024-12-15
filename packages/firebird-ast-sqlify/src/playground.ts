import { Parser } from 'node-sql-parser'
import { sqlify } from './index'
import { astSchema } from './ast-schema'

// const sql = ' SELECT `mysql`.`items`.`itemid` FROM `mysql`.`items` LEFT JOIN `mysql`.`colors` AS `j1` ON (`j1`.`colorId`) = (`mysql`.`items`.`colorId`) WHERE (`j1`.`colorId` = ? AND (`j1`.`colorId` IS NOT NULL))'
// const sql =
//   'SELECT `mysql`.`items`.`itemid` FROM `mysql`.`items`  WHERE (`j1`.`colorId` = ? AND (`j1`.`colorId` IS NOT NULL))'
// const args = [10]

const sql = 'SELECT round(colorId) FROM colors'
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
