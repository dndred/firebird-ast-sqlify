import type {FirebirdColumnType} from "./sql-types-map.ts";

export type FirebirdResultMeta = {
    type: FirebirdColumnType
    nullable: boolean
    subType: number
    scale: number
    length: number
    field: string
    relation: string
    alias: string
    decode: () => unknown
    calcBlr: () => unknown

}[]
