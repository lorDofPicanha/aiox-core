-- Rollback for Contador F1-D0 foundation.
-- Use only against disposable/dev databases unless an operator confirms impact.

begin;

drop schema if exists core_api_v1 cascade;
drop schema if exists billing cascade;
drop schema if exists ecac cascade;
drop schema if exists ingestao cascade;
drop schema if exists gestao cascade;
drop schema if exists core cascade;
drop schema if exists ref cascade;
drop schema if exists app cascade;

commit;
