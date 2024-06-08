import { convertSqlToFirebird } from "firebird-ast-sqlify";

console.log(convertSqlToFirebird("select id, colorname from colors"));
