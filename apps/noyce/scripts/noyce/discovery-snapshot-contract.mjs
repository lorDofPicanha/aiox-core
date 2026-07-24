const MIN_MUNICIPIOS_500KM = 400;
const MIN_UFS_500KM = 7;

/** Refuses partial discovery results instead of replacing the last healthy snapshot. */
export function assertPublishableDiscoverySnapshot(snapshot) {
  const errors = [];
  if (snapshot.raioKm !== 500) errors.push(`raioKm deve ser 500 (recebido ${snapshot.raioKm})`);
  if (snapshot.municipiosNoRaio < MIN_MUNICIPIOS_500KM) {
    errors.push(`municipiosNoRaio deve ser >= ${MIN_MUNICIPIOS_500KM} (recebido ${snapshot.municipiosNoRaio})`);
  }
  if (!Array.isArray(snapshot.ufs) || snapshot.ufs.length < MIN_UFS_500KM) {
    errors.push(`ufs deve conter ao menos ${MIN_UFS_500KM} UFs`);
  }
  if (!Array.isArray(snapshot.items) || snapshot.items.length === 0) errors.push("snapshot não pode ser vazio");
  if ((snapshot.queryStats?.failQueries ?? 0) > 0) errors.push(`coleta parcial: ${snapshot.queryStats.failQueries} consulta(s) falharam`);
  if ((snapshot.queryStats?.okQueries ?? 0) === 0) errors.push("nenhuma consulta PNCP bem-sucedida");
  if (errors.length) throw new Error(`snapshot 500 km não publicado: ${errors.join("; ")}`);
}

export const DISCOVERY_COVERAGE = { MIN_MUNICIPIOS_500KM, MIN_UFS_500KM };
