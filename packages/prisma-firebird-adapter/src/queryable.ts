import { err, ok } from '@prisma/driver-adapter-utils'
import type { Query, Queryable, Result, ResultSet } from '@prisma/driver-adapter-utils'
import type { Transaction as FirebirdTransaction } from 'node-firebird'
import {convertSqlToFirebird} from 'firebird-ast-sqlify'

export class FirebirdQueryable implements Queryable {
  adapterName = 'firebird'
  provider = 'mysql' as const
  constructor(private transaction: FirebirdTransaction) {}

  queryRaw({ sql, args }: Query): Promise<Result<ResultSet>> {
    console.log(sql, args)
    const convertedSql = convertSqlToFirebird(sql)

    return new Promise((resolve) => {
      this.transaction.query(convertedSql, args, (queryError, result) => {
        console.log(JSON.stringify(result))

        if (queryError) {
          console.error('Error querying', queryError)
          return resolve(err({ kind: 'Mysql', ...queryError }))
        }

        const r = {
          columnTypes: [],
          columnNames: [],
          rows: [],
        }
        resolve(ok(r))
      })
    })
  }

  executeRaw({ sql, args }: Query): Promise<Result<number>> {
    console.log(sql, args)
    if (sql === 'BEGIN') return Promise.resolve(ok(0))
    throw new Error('Method not implemented.')
  }
}
