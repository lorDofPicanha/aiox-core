-- Export good-faith ledger events for contador-closeout-manifest.
-- Required psql variables:
--   :escritorio_id
--   :periodo_inicio
--   :periodo_fim
--
-- Example:
-- psql "$DATABASE_URL" \
--   -v escritorio_id="'11111111-1111-4111-8111-111111111111'" \
--   -v periodo_inicio="'2026-06-15T00:00:00Z'" \
--   -v periodo_fim="'2026-06-16T00:00:00Z'" \
--   -f packages/contador-db/queries/export-closeout-events.sql

\pset format unaligned
\pset tuples_only on

select coalesce(jsonb_agg(evento order by (evento->>'seq_tenant')::bigint), '[]'::jsonb)::text
from (
  select jsonb_build_object(
    'id', e.id,
    'escritorio_id', e.escritorio_id::text,
    'seq_tenant', e.seq_tenant,
    'hash_ver', e.hash_ver,
    'tipo_evento', e.tipo_evento,
    'ator_tipo', e.ator_tipo,
    'ator_id', e.ator_id::text,
    'referente_tipo', e.referente_tipo,
    'referente_id', e.referente_id::text,
    'nota_id', e.nota_id::text,
    'apontamento_id', e.apontamento_id::text,
    'laudo_id', e.laudo_id::text,
    'payload', e.payload,
    'ocorrido_em', to_char(e.ocorrido_em at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"'),
    'hash_anterior', encode(e.hash_anterior, 'hex'),
    'hash_evento', encode(e.hash_evento, 'hex')
  ) as evento
  from core.evento_boa_fe e
  where e.escritorio_id = :escritorio_id::uuid
    and e.ocorrido_em >= :periodo_inicio::timestamptz
    and e.ocorrido_em < :periodo_fim::timestamptz
  order by e.seq_tenant
) exported;
