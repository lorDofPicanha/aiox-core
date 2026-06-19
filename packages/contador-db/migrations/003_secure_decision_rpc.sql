-- Migration: 003_secure_decision_rpc.sql
-- Purpose: bind human decision RPCs to the authenticated caller and strengthen fiscal evidence snapshots.

begin;

create or replace function app.current_user_id()
returns uuid language sql stable
as $$
  select nullif(coalesce(current_setting('request.jwt.claims', true)::jsonb ->> 'sub', ''), '')::uuid
$$;
comment on function app.current_user_id is
  '[F1.2] Single place that knows Supabase JWT subject claim format.';

create or replace function core_api_v1.decision_evidence_payload(
  p_apontamento_id uuid,
  p_revisor_id uuid,
  p_motivo_codigo text,
  p_motivo_texto text default null,
  p_extra jsonb default '{}'
)
returns jsonb
language plpgsql
security definer
set search_path = core_api_v1, core, app, pg_catalog
as $$
declare
  v_apont core.apontamento_auditoria%rowtype;
  v_revisor core.usuario%rowtype;
  v_item core.nota_item%rowtype;
  v_nota core.nota%rowtype;
  v_fiscal_snapshot jsonb;
  v_evidencia_hash bytea;
begin
  select * into v_apont
    from core.apontamento_auditoria
   where id = p_apontamento_id;

  select * into v_revisor
    from core.usuario
   where id = p_revisor_id;

  select * into v_item
    from core.nota_item
   where id = v_apont.item_id;

  select * into v_nota
    from core.nota
   where id = v_item.nota_id
     and competencia = v_item.competencia;

  v_fiscal_snapshot := jsonb_strip_nulls(jsonb_build_object(
    'nota', jsonb_build_object(
      'nota_id', v_nota.id,
      'competencia', v_nota.competencia,
      'tipo', v_nota.tipo,
      'direcao', v_nota.direcao,
      'chave_acesso', v_nota.chave_acesso,
      'chave_dedup', v_nota.chave_dedup,
      'numero', v_nota.numero,
      'serie', v_nota.serie,
      'emitida_em', v_nota.emitida_em,
      'emitente_cnpj', v_nota.emitente_cnpj,
      'destinatario_doc', v_nota.destinatario_doc,
      'valor_total', v_nota.valor_total,
      'xml_hash', case when v_nota.xml_hash is null then null else encode(v_nota.xml_hash, 'hex') end
    ),
    'item', jsonb_build_object(
      'item_id', v_item.id,
      'numero_item', v_item.numero_item,
      'descricao', v_item.descricao,
      'ncm', v_item.ncm,
      'cfop', v_item.cfop,
      'cst', v_item.cst,
      'cclasstrib_informado', v_item.cclasstrib_informado,
      'quantidade', v_item.quantidade,
      'valor_item', v_item.valor_item
    ),
    'apontamento', jsonb_build_object(
      'apontamento_id', v_apont.id,
      'tipo_divergencia', v_apont.tipo_divergencia,
      'cclasstrib_referencia', v_apont.cclasstrib_referencia,
      'campo_corrigir', v_apont.campo_corrigir,
      'descricao', v_apont.descricao,
      'valor_envolvido', v_apont.valor_envolvido,
      'confianca', v_apont.confianca,
      'banda_confianca', v_apont.banda_confianca,
      'fundamento', v_apont.fundamento,
      'fato_gerador_em', v_apont.fato_gerador_em
    )
  ));

  v_evidencia_hash := public.digest(v_fiscal_snapshot::text, 'sha256');

  return jsonb_strip_nulls(jsonb_build_object(
    'decisao_individualizada', true,
    'motivo_codigo', p_motivo_codigo,
    'motivo_texto', p_motivo_texto,
    'revisor_snapshot', jsonb_build_object(
      'usuario_id', v_revisor.id,
      'nome', v_revisor.nome,
      'cpf', v_revisor.cpf,
      'crc', v_revisor.crc,
      'crc_uf', v_revisor.crc_uf,
      'crc_situacao', v_revisor.crc_situacao,
      'validado_em', now()
    ),
    'evidencia_ref', jsonb_build_object(
      'nota_id', v_nota.id,
      'nota_xml_hash', case when v_nota.xml_hash is null then null else encode(v_nota.xml_hash, 'hex') end,
      'item_id', v_item.id,
      'apontamento_id', v_apont.id,
      'analise_execucao_id', v_apont.analise_execucao_id,
      'base_versao_id', v_apont.base_versao_id,
      'motor_versao_id', v_apont.motor_versao_id,
      'regra_id', v_apont.regra_id,
      'tipo_divergencia', v_apont.tipo_divergencia,
      'cclasstrib_referencia', v_apont.cclasstrib_referencia,
      'fundamento', v_apont.fundamento,
      'evidencia_hash', encode(v_evidencia_hash, 'hex')
    ),
    'fiscal_snapshot', v_fiscal_snapshot
  ) || coalesce(p_extra, '{}'));
end $$;

create or replace function core_api_v1.assert_human_decision_context(
  p_escritorio_id uuid,
  p_revisor_id uuid,
  p_operation text
)
returns void
language plpgsql
security definer
set search_path = core_api_v1, core, app, pg_catalog
as $$
begin
  if app.current_escritorio_id() is null then
    raise exception '[P20] tenant claim required for %', p_operation;
  end if;

  if app.current_escritorio_id() <> p_escritorio_id then
    raise exception '[P20] tenant mismatch for %', p_operation;
  end if;

  if app.current_user_id() is null then
    raise exception '[P17] authenticated user claim required for %', p_operation;
  end if;

  if app.current_user_id() <> p_revisor_id then
    raise exception '[P17] caller must be the reviewer for %', p_operation;
  end if;

  if coalesce(app.current_papel(), '') <> 'contador' then
    raise exception '[P17] caller role must be contador for %', p_operation;
  end if;
end $$;

create or replace function core_api_v1.aprovar_apontamento(
  p_apontamento_id uuid,
  p_revisor_id uuid,
  p_motivo_codigo text default 'aprovado',
  p_motivo_texto text default null
)
returns uuid
language plpgsql
security definer
set search_path = core_api_v1, core, app, pg_catalog
as $$
declare
  v_apont core.apontamento_auditoria%rowtype;
  v_revisor core.usuario%rowtype;
  v_item core.nota_item%rowtype;
begin
  select * into v_apont
    from core.apontamento_auditoria
   where id = p_apontamento_id
     and status = 'pendente'
   for update;

  if v_apont.id is null then
    raise exception 'apontamento not found or not pending: %', p_apontamento_id;
  end if;

  perform core_api_v1.assert_human_decision_context(v_apont.escritorio_id, p_revisor_id, 'aprovar_apontamento');

  select * into v_revisor
    from core.usuario u
   where u.id = p_revisor_id
     and u.escritorio_id = v_apont.escritorio_id
     and u.ativo = true
     and u.papel = 'contador'
     and u.crc is not null
     and u.crc_situacao = 'ativo';
  if v_revisor.id is null then
    raise exception '[P17] reviewer % is not an active contador with CRC for escritorio %', p_revisor_id, v_apont.escritorio_id;
  end if;

  select * into v_item
    from core.nota_item
   where id = v_apont.item_id;

  insert into core.evento_boa_fe (
    escritorio_id, tipo_evento, ator_tipo, ator_id, referente_tipo, referente_id,
    nota_id, apontamento_id, payload
  )
  values (
    v_apont.escritorio_id, 'apontamento_aprovado', 'usuario', p_revisor_id, 'apontamento', p_apontamento_id,
    v_item.nota_id, p_apontamento_id,
    core_api_v1.decision_evidence_payload(p_apontamento_id, p_revisor_id, p_motivo_codigo, p_motivo_texto)
  );

  update core.apontamento_auditoria
     set status = 'aprovado',
         revisor_id = p_revisor_id,
         revisado_em = now(),
         motivo_codigo = p_motivo_codigo,
         motivo_texto = p_motivo_texto
   where id = p_apontamento_id;

  return p_apontamento_id;
end $$;

create or replace function core_api_v1.rejeitar_apontamento(
  p_apontamento_id uuid,
  p_revisor_id uuid,
  p_motivo_codigo text,
  p_motivo_texto text default null
)
returns uuid
language plpgsql
security definer
set search_path = core_api_v1, core, app, pg_catalog
as $$
declare
  v_apont core.apontamento_auditoria%rowtype;
  v_revisor core.usuario%rowtype;
  v_item core.nota_item%rowtype;
begin
  select * into v_apont
    from core.apontamento_auditoria
   where id = p_apontamento_id
     and status = 'pendente'
   for update;

  if v_apont.id is null then
    raise exception 'apontamento not found or not pending: %', p_apontamento_id;
  end if;

  perform core_api_v1.assert_human_decision_context(v_apont.escritorio_id, p_revisor_id, 'rejeitar_apontamento');

  select * into v_revisor
    from core.usuario u
   where u.id = p_revisor_id
     and u.escritorio_id = v_apont.escritorio_id
     and u.ativo = true
     and u.papel = 'contador'
     and u.crc is not null
     and u.crc_situacao = 'ativo';
  if v_revisor.id is null then
    raise exception '[P17] reviewer % is not an active contador with CRC for escritorio %', p_revisor_id, v_apont.escritorio_id;
  end if;

  select * into v_item
    from core.nota_item
   where id = v_apont.item_id;

  insert into core.evento_boa_fe (
    escritorio_id, tipo_evento, ator_tipo, ator_id, referente_tipo, referente_id,
    nota_id, apontamento_id, payload
  )
  values (
    v_apont.escritorio_id, 'apontamento_rejeitado', 'usuario', p_revisor_id, 'apontamento', p_apontamento_id,
    v_item.nota_id, p_apontamento_id,
    core_api_v1.decision_evidence_payload(p_apontamento_id, p_revisor_id, p_motivo_codigo, p_motivo_texto)
  );

  update core.apontamento_auditoria
     set status = 'rejeitado',
         revisor_id = p_revisor_id,
         revisado_em = now(),
         motivo_codigo = p_motivo_codigo,
         motivo_texto = p_motivo_texto
   where id = p_apontamento_id;

  return p_apontamento_id;
end $$;

create or replace function core_api_v1.superar_apontamento(
  p_apontamento_id uuid,
  p_revisor_id uuid,
  p_conhecida_em timestamptz,
  p_vigencia daterange
)
returns uuid
language plpgsql
security definer
set search_path = core_api_v1, core, app, pg_catalog
as $$
declare
  v_apont core.apontamento_auditoria%rowtype;
  v_revisor core.usuario%rowtype;
  v_item core.nota_item%rowtype;
begin
  select * into v_apont
    from core.apontamento_auditoria
   where id = p_apontamento_id
     and status <> 'superado'
   for update;

  if v_apont.id is null then
    raise exception 'apontamento not found or already superado: %', p_apontamento_id;
  end if;

  perform core_api_v1.assert_human_decision_context(v_apont.escritorio_id, p_revisor_id, 'superar_apontamento');

  select * into v_revisor
    from core.usuario u
   where u.id = p_revisor_id
     and u.escritorio_id = v_apont.escritorio_id
     and u.ativo = true
     and u.papel = 'contador'
     and u.crc is not null
     and u.crc_situacao = 'ativo';
  if v_revisor.id is null then
    raise exception '[P17] reviewer % is not an active contador with CRC for escritorio %', p_revisor_id, v_apont.escritorio_id;
  end if;

  select * into v_item
    from core.nota_item
   where id = v_apont.item_id;

  insert into core.evento_boa_fe (
    escritorio_id, tipo_evento, ator_tipo, ator_id, referente_tipo, referente_id,
    nota_id, apontamento_id, payload
  )
  values (
    v_apont.escritorio_id, 'apontamento_superado', 'usuario', p_revisor_id, 'apontamento', p_apontamento_id,
    v_item.nota_id, p_apontamento_id,
    core_api_v1.decision_evidence_payload(
      p_apontamento_id,
      p_revisor_id,
      'superado',
      null,
      jsonb_build_object('conhecida_em', p_conhecida_em, 'vigencia', p_vigencia::text)
    )
  );

  update core.apontamento_auditoria
     set status = 'superado',
         revisor_id = p_revisor_id,
         revisado_em = now(),
         motivo_codigo = 'superado'
   where id = p_apontamento_id;

  return p_apontamento_id;
end $$;

comment on function core_api_v1.assert_human_decision_context is
  '[F1.2] Human decision RPCs require tenant claim, caller subject = reviewer, and caller role contador.';
comment on function core_api_v1.decision_evidence_payload is
  '[F1.2] Builds CRC snapshot, fiscal snapshot, and evidence hash for human decision events.';
comment on function core_api_v1.aprovar_apontamento is
  '[P17][F1.2] Authenticated caller-bound decision with CRC snapshot and fiscal evidence hash.';
comment on function core_api_v1.rejeitar_apontamento is
  '[P17][F1.2] Authenticated caller-bound rejection with CRC snapshot and fiscal evidence hash.';
comment on function core_api_v1.superar_apontamento is
  '[P22][F1.2] Authenticated caller-bound bitemporal supersession with evidence hash.';

revoke all on function core_api_v1.assert_human_decision_context(uuid, uuid, text) from public, authenticated, anon, motor;
revoke all on function core_api_v1.decision_evidence_payload(uuid, uuid, text, text, jsonb) from public, authenticated, anon, motor;
revoke all on function core_api_v1.aprovar_apontamento(uuid, uuid, text, text) from public, anon, motor;
revoke all on function core_api_v1.rejeitar_apontamento(uuid, uuid, text, text) from public, anon, motor;
revoke all on function core_api_v1.superar_apontamento(uuid, uuid, timestamptz, daterange) from public, anon, motor;
grant execute on function core_api_v1.aprovar_apontamento(uuid, uuid, text, text) to authenticated;
grant execute on function core_api_v1.rejeitar_apontamento(uuid, uuid, text, text) to authenticated;
grant execute on function core_api_v1.superar_apontamento(uuid, uuid, timestamptz, daterange) to authenticated;

commit;
