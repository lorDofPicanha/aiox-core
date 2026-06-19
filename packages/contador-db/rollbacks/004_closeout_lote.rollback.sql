-- Rollback for 004_closeout_lote.sql.

drop table if exists core.closeout_lote cascade;
drop function if exists core_api_v1.registrar_closeout(
  uuid, text, timestamptz, timestamptz, bigint, bigint, bigint, bigint, integer, bytea, bytea, bytea, text, smallint, text, jsonb, bytea, uuid, text, text
);
