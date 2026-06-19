-- Migration: 002_decision_evidence.sql
-- Purpose: strengthen human decision events with CRC snapshots and immutable evidence references.

begin;

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
  v_nota_id uuid;
begin
  select *
    into v_apont
    from core.apontamento_auditoria
   where id = p_apontamento_id
     and status = 'pendente'
   for update;

  if v_apont.id is null then
    raise exception 'apontamento not found or not pending: %', p_apontamento_id;
  end if;

  select *
    into v_revisor
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

  if app.current_escritorio_id() is not null and app.current_escritorio_id() <> v_apont.escritorio_id then
    raise exception '[P20] tenant mismatch for aprovar_apontamento';
  end if;

  select ni.nota_id
    into v_nota_id
    from core.nota_item ni
   where ni.id = v_apont.item_id;

  insert into core.evento_boa_fe (
    escritorio_id,
    tipo_evento,
    ator_tipo,
    ator_id,
    referente_tipo,
    referente_id,
    nota_id,
    apontamento_id,
    payload
  )
  values (
    v_apont.escritorio_id,
    'apontamento_aprovado',
    'usuario',
    p_revisor_id,
    'apontamento',
    p_apontamento_id,
    v_nota_id,
    p_apontamento_id,
    jsonb_build_object(
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
        'nota_id', v_nota_id,
        'item_id', v_apont.item_id,
        'apontamento_id', v_apont.id,
        'analise_execucao_id', v_apont.analise_execucao_id,
        'base_versao_id', v_apont.base_versao_id,
        'motor_versao_id', v_apont.motor_versao_id,
        'regra_id', v_apont.regra_id,
        'tipo_divergencia', v_apont.tipo_divergencia,
        'cclasstrib_referencia', v_apont.cclasstrib_referencia,
        'fundamento', v_apont.fundamento
      )
    )
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
  v_nota_id uuid;
begin
  select *
    into v_apont
    from core.apontamento_auditoria
   where id = p_apontamento_id
     and status = 'pendente'
   for update;

  if v_apont.id is null then
    raise exception 'apontamento not found or not pending: %', p_apontamento_id;
  end if;

  select *
    into v_revisor
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

  if app.current_escritorio_id() is not null and app.current_escritorio_id() <> v_apont.escritorio_id then
    raise exception '[P20] tenant mismatch for rejeitar_apontamento';
  end if;

  select ni.nota_id
    into v_nota_id
    from core.nota_item ni
   where ni.id = v_apont.item_id;

  insert into core.evento_boa_fe (
    escritorio_id,
    tipo_evento,
    ator_tipo,
    ator_id,
    referente_tipo,
    referente_id,
    nota_id,
    apontamento_id,
    payload
  )
  values (
    v_apont.escritorio_id,
    'apontamento_rejeitado',
    'usuario',
    p_revisor_id,
    'apontamento',
    p_apontamento_id,
    v_nota_id,
    p_apontamento_id,
    jsonb_build_object(
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
        'nota_id', v_nota_id,
        'item_id', v_apont.item_id,
        'apontamento_id', v_apont.id,
        'analise_execucao_id', v_apont.analise_execucao_id,
        'base_versao_id', v_apont.base_versao_id,
        'motor_versao_id', v_apont.motor_versao_id,
        'regra_id', v_apont.regra_id,
        'tipo_divergencia', v_apont.tipo_divergencia,
        'cclasstrib_referencia', v_apont.cclasstrib_referencia,
        'fundamento', v_apont.fundamento
      )
    )
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
  v_nota_id uuid;
begin
  select *
    into v_apont
    from core.apontamento_auditoria
   where id = p_apontamento_id
     and status <> 'superado'
   for update;

  if v_apont.id is null then
    raise exception 'apontamento not found or already superado: %', p_apontamento_id;
  end if;

  select *
    into v_revisor
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

  if app.current_escritorio_id() is not null and app.current_escritorio_id() <> v_apont.escritorio_id then
    raise exception '[P20] tenant mismatch for superar_apontamento';
  end if;

  select ni.nota_id
    into v_nota_id
    from core.nota_item ni
   where ni.id = v_apont.item_id;

  insert into core.evento_boa_fe (
    escritorio_id,
    tipo_evento,
    ator_tipo,
    ator_id,
    referente_tipo,
    referente_id,
    nota_id,
    apontamento_id,
    payload
  )
  values (
    v_apont.escritorio_id,
    'apontamento_superado',
    'usuario',
    p_revisor_id,
    'apontamento',
    p_apontamento_id,
    v_nota_id,
    p_apontamento_id,
    jsonb_build_object(
      'conhecida_em', p_conhecida_em,
      'vigencia', p_vigencia::text,
      'decisao_individualizada', true,
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
        'nota_id', v_nota_id,
        'item_id', v_apont.item_id,
        'apontamento_id', v_apont.id,
        'analise_execucao_id', v_apont.analise_execucao_id,
        'base_versao_id', v_apont.base_versao_id,
        'motor_versao_id', v_apont.motor_versao_id,
        'regra_id', v_apont.regra_id,
        'tipo_divergencia', v_apont.tipo_divergencia,
        'cclasstrib_referencia', v_apont.cclasstrib_referencia,
        'fundamento', v_apont.fundamento
      )
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

comment on function core_api_v1.aprovar_apontamento is
  '[P17][F1.1] Individualized human decision with CRC snapshot and evidence references.';
comment on function core_api_v1.rejeitar_apontamento is
  '[P17][F1.1] Individualized rejection with CRC snapshot and evidence references.';
comment on function core_api_v1.superar_apontamento is
  '[P22][F1.1] Bitemporal supersession with CRC snapshot and evidence references.';

commit;
