import { err, ok, type Transaction as PrismaTransaction } from '@prisma/driver-adapter-utils'
import { type Transaction as FirebirdTransaction } from 'node-firebird'
import { FirebirdQueryable } from './queryable.ts'

const errorKind = 'Mysql'

export const wrapFirebirdTransaction = (firebirdTransaction: FirebirdTransaction): PrismaTransaction => {
  const queryable = new FirebirdQueryable(firebirdTransaction)

  return {
    options: {
      usePhantomQuery: false,
    },
    commit: () =>
      new Promise((resolveCommit) =>
        firebirdTransaction.commit((commitError) => {
          if (commitError) {
            console.error('Error committing transaction', commitError)
            return resolveCommit(err({ kind: errorKind, ...commitError }))
          }
          resolveCommit(ok(undefined))
        }),
      ),
    rollback: () =>
      new Promise((resolveRollback) =>
        firebirdTransaction.rollback((rollbackError) => {
          if (rollbackError) {
            console.error('Error rolling back transaction', rollbackError)
            return resolveRollback(err({ kind: errorKind, ...rollbackError }))
          }
          resolveRollback(ok(undefined))
        }),
      ),
    ...queryable,
    executeRaw: queryable.executeRaw,
    queryRaw: queryable.queryRaw,
  }
}
