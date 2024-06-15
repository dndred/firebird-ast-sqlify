
// node-firebird/lib/index.js
const
    SQL_TEXT      = 452, // Array of char
    SQL_VARYING   = 448,
    SQL_SHORT     = 500,
    SQL_LONG      = 496,
    SQL_FLOAT     = 482,
    SQL_DOUBLE    = 480,
    SQL_D_FLOAT   = 530,
    SQL_TIMESTAMP = 510,
    SQL_BLOB      = 520,
    SQL_ARRAY     = 540,
    SQL_QUAD      = 550,
    SQL_TYPE_TIME = 560,
    SQL_TYPE_DATE = 570,
    SQL_INT64     = 580,
    SQL_BOOLEAN   = 32764, // >= 3.0
    SQL_NULL      = 32766; // >= 2.5

export type FirebirdColumnType = typeof SQL_TEXT | typeof SQL_VARYING | typeof SQL_LONG
