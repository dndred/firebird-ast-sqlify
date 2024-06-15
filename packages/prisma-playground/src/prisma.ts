import { PrismaClient } from '@prisma/client'
import { FirebirdAdapter } from 'prisma-firebird-adapter'

const adapter = new FirebirdAdapter(5, {
  host: 'localhost',
  port: 3050,
  database: '/data/firebird/IBDATA.GDB',
  user: 'SYSDBA',
  password: 'masterkey',
})

export const prisma = new PrismaClient({ adapter, log: ['query'] })
