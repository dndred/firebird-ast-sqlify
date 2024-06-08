import { z } from 'zod'
import { selectSchema } from './select'
import { insertSchema } from './insert'

export const astSchema = z.union([selectSchema, insertSchema])

export type Ast = z.infer<typeof astSchema>
