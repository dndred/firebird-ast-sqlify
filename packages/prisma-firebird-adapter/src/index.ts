import type { DriverAdapter } from '@prisma/driver-adapter-utils'
import { FirebirdQueryable } from './queryable.ts'

export class FirebirdAdapter extends FirebirdQueryable implements DriverAdapter {}
