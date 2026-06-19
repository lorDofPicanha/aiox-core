-- Contract checks for 002_decision_evidence.sql.
-- Run after migrations on a disposable Postgres 15+ database.

begin;

do $$
declare
  v_escritorio_id uuid := '11111111-1111-4111-8111-111111111111';
  v_cliente_id uuid := '22222222-2222-4222-8222-222222222222';
  v_usuario_id uuid := '33333333-3333-4333-8333-333333333333';
  v_base_id uuid := '44444444-4444-4444-8444-444444444444';
  v_nota_id uuid := '55555555-5555-4555-8555-555555555555';
  v_item_id uuid := '66666666-6666-4666-8666-666666666666';
  v_analise_id uuid := '77777777-7777-4777-8777-777777777777';
  v_apontamento_id uuid := '88888888-8888-4888-8888-888888888888';
  v_motor_id uuid;
  v_payload jsonb;
begin
  select id into v_motor_id from ref.motor_versao limit 1;

  insert into core.escritorio (id, nome, plano)
  values (v_escritorio_id, 'Contrato F1.1', 'smoke');

  insert into core.cliente (id, escritorio_id, nome, documento)
  values (v_cliente_id, v_escritorio_id, 'Cliente Smoke', '00000000000191');

  insert into core.usuario (id, escritorio_id, nome, email, papel, cpf, crc, crc_uf, crc_situacao, ativo)
  values (v_usuario_id, v_escritorio_id, 'Contador Smoke', 'contador-smoke@example.com', 'contador', '12345678901', 'CRC-12345', 'SC', 'ativo', true);

  insert into ref.base_versao (id, rotulo, fonte, vigente_desde, hash_conteudo)
  values (v_base_id, 'base-smoke-002', 'oficial', '2026-01-01', digest('base-smoke-002', 'sha256'));

  insert into core.nota (
    id, escritorio_id, cliente_id, competencia, tipo, direcao, chave_dedup,
    numero, serie, emitida_em, emitente_cnpj, destinatario_doc, valor_total, origem
  )
  values (
    v_nota_id, v_escritorio_id, v_cliente_id, '2026-01-01', 'nfe', 'venda', 'dedup-smoke-002',
    '1', '1', '2026-01-15', '00000000000191', '00000000000272', 100.00, 'manual'
  );

  insert into core.nota_item (
    id, escritorio_id, nota_id, competencia, numero_item, descricao, ncm,
    cclasstrib_informado, valor_item
  )
  values (
    v_item_id, v_escritorio_id, v_nota_id, '2026-01-01', 1, 'Item smoke', '12345678',
    '000001', 100.00
  );

  insert into core.analise_execucao (
    id, escritorio_id, item_id, motor_versao_id, base_versao_id, tipo_inferencia
  )
  values (
    v_analise_id, v_escritorio_id, v_item_id, v_motor_id, v_base_id, 'regra_deterministica'
  );

  insert into core.apontamento_auditoria (
    id, escritorio_id, cliente_id, item_id, base_versao_id, motor_versao_id,
    analise_execucao_id, tipo_inferencia, origem, tipo_divergencia,
    cclasstrib_referencia, descricao, fundamento
  )
  values (
    v_apontamento_id, v_escritorio_id, v_cliente_id, v_item_id, v_base_id, v_motor_id,
    v_analise_id, 'regra_deterministica', 'motor', 'cclasstrib_divergente',
    '000002', 'Divergencia smoke', '[{"fonte":"smoke"}]'::jsonb
  );

  perform set_config(
    'request.jwt.claims',
    jsonb_build_object(
      'sub', v_usuario_id::text,
      'app_metadata', jsonb_build_object('escritorio_id', v_escritorio_id::text, 'papel', 'contador')
    )::text,
    true
  );

  perform core_api_v1.aprovar_apontamento(v_apontamento_id, v_usuario_id, 'aprovado', 'teste contrato 002');

  select payload
    into v_payload
    from core.evento_boa_fe
   where tipo_evento = 'apontamento_aprovado'
     and apontamento_id = v_apontamento_id;

  if v_payload #>> '{revisor_snapshot,crc}' <> 'CRC-12345' then
    raise exception 'decision event must persist reviewer CRC snapshot';
  end if;

  if v_payload #>> '{revisor_snapshot,crc_situacao}' <> 'ativo' then
    raise exception 'decision event must persist reviewer CRC status snapshot';
  end if;

  if (v_payload #>> '{evidencia_ref,base_versao_id}')::uuid <> v_base_id then
    raise exception 'decision event must persist base version evidence reference';
  end if;

  if (v_payload #>> '{evidencia_ref,analise_execucao_id}')::uuid <> v_analise_id then
    raise exception 'decision event must persist analysis execution evidence reference';
  end if;

  if (v_payload #>> '{evidencia_ref,nota_id}')::uuid <> v_nota_id then
    raise exception 'decision event must persist nota evidence reference';
  end if;
end $$;

rollback;
