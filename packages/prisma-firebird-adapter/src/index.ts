import type { DriverAdapter, Result, Transaction } from '@prisma/driver-adapter-utils'
import { ok, err } from '@prisma/driver-adapter-utils'
import { type ConnectionPool, ISOLATION_READ_COMMITTED, pool, type Options } from 'node-firebird'
import { FirebirdQueryable } from './queryable.ts'
import { wrapFirebirdTransaction } from './transaction.ts'

const errorKind = 'Mysql'

export class FirebirdAdapter extends FirebirdQueryable implements DriverAdapter {
  private dbPool: ConnectionPool

  constructor(maxConnections: number, options: Options) {
    super()
    this.dbPool = pool(maxConnections, options)
  }

  startTransaction(): Promise<Result<Transaction>> {
    return new Promise((resolve) => {
      this.dbPool.get((dbPoolError, db) => {
        if (dbPoolError) {
          console.error('Error getting connection from pool', dbPoolError)
          return resolve(err({ kind: errorKind, ...dbPoolError }))
        }

        db.transaction(ISOLATION_READ_COMMITTED, (transactionError, transaction) => {
          if (transactionError) {
            console.error('Error starting transaction', transactionError)
            return resolve(err({ kind: errorKind, ...transactionError }))
          }

          resolve(ok(wrapFirebirdTransaction(transaction)))
        })
      })
    })
  }
}
