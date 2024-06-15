import {
  type ColumnType,
  err,
  ok,
  type Query,
  type Queryable,
  type Result,
  type ResultSet,
  type Transaction,
} from '@prisma/driver-adapter-utils'
import {
  type ConnectionPool,
  type Database,
  ISOLATION_READ_COMMITTED,
  type Options,
  pool,
  type Transaction as FirebirdTransaction,
} from 'node-firebird'
import { convertSqlToFirebird } from 'firebird-ast-sqlify'
import type { FirebirdResultMeta } from './firebird-result-meta.ts'
import type { FirebirdResult } from './firebird-result.ts'
import { mapFirebirdTypeToPrisma } from './sql-types-map.ts'

export class FirebirdQueryable implements Queryable {
  adapterName = 'firebird'
  provider = 'mysql' as const
  private dbPool: ConnectionPool

  constructor(maxConnections: number, options: Options) {
    this.dbPool = pool(maxConnections, options)
  }

  async queryRaw({ sql, args }: Query): Promise<Result<ResultSet>> {
    console.log('queryRaw', sql, args)

    const convertedSql = convertSqlToFirebird(sql)
    console.log('Converted SQL', convertedSql)
    const db = await this.getDb()

    return new Promise((resolve) => {
      db.execute(
        convertedSql,
        args,
        (queryError: unknown, rows: FirebirdResult, meta: FirebirdResultMeta) => {
          console.log('meta', meta)
          // console.log(JSON.stringify(result))

          if (queryError) {
            console.error('Error querying', queryError)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            return resolve(err({ kind: 'Mysql', ...queryError }))
          }
          const columnNames = meta.map((metaItem) => metaItem.field)
          const columnTypes: ColumnType[] = meta.map((metaItem) => {
            return mapFirebirdTypeToPrisma(metaItem.type)
          })
          const result: ResultSet = {
            columnTypes,
            columnNames,
            rows,
          }
          resolve(ok(result))
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        { asObject: false },
      )
    })
  }

  executeRaw({ sql, args }: Query): Promise<Result<number>> {
    console.log('executeRaw', sql, args)
    if (sql === 'BEGIN') return Promise.resolve(ok(0))
    throw new Error('Method not implemented.')
  }

  private async getDb(): Promise<Database> {
    return new Promise((resolve) => {
      this.dbPool.get((err, db) => {
        if (err) {
          console.error('Error getting connection from pool', err)
          throw err
        }
        resolve(db)
      })
    })
  }

  private async startFirebirdTransaction(): Promise<FirebirdTransaction> {
    return new Promise((resolveTransaction) => {
      this.dbPool.get((dbPoolError, db) => {
        if (dbPoolError) {
          console.error('Error getting connection from pool', dbPoolError)
          throw dbPoolError
        }

        db.transaction(ISOLATION_READ_COMMITTED, (transactionError, transaction) => {
          if (transactionError) {
            console.error('Error starting transaction', transactionError)
            throw transactionError
          }

          resolveTransaction(transaction)
        })
      })
    })
  }

  startTransaction(): Promise<Result<Transaction>> {
    throw new Error('Method startTransaction not implemented.')
  }
}
