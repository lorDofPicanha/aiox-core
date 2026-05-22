#!/usr/bin/env python3
"""Conta municipios dentro de um raio (km) de um ponto, via dataset IBGE.
Uso: python radius-municipios.py [raio_km] [lat] [lon]
Default: 500 km a partir de Aguas Lindas de Goias.
Dataset: kelvins/municipios-brasileiros (CSV publico).
"""
import sys, math, csv, io, urllib.request

RAIO = float(sys.argv[1]) if len(sys.argv) > 1 else 500.0
LAT0 = float(sys.argv[2]) if len(sys.argv) > 2 else -15.7589   # Aguas Lindas de Goias
LON0 = float(sys.argv[3]) if len(sys.argv) > 3 else -48.2828
R = 6371.0

UF = {11:"RO",12:"AC",13:"AM",14:"RR",15:"PA",16:"AP",17:"TO",21:"MA",22:"PI",
      23:"CE",24:"RN",25:"PB",26:"PE",27:"AL",28:"SE",29:"BA",31:"MG",32:"ES",
      33:"RJ",35:"SP",41:"PR",42:"SC",43:"RS",50:"MS",51:"MT",52:"GO",53:"DF"}

URL = "https://raw.githubusercontent.com/kelvins/municipios-brasileiros/main/csv/municipios.csv"

def hav(lat, lon):
    p1, p2 = math.radians(LAT0), math.radians(lat)
    dphi = math.radians(lat - LAT0); dl = math.radians(lon - LON0)
    a = math.sin(dphi/2)**2 + math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2
    return 2*R*math.asin(math.sqrt(a))

print(f"Centro: ({LAT0}, {LON0}) | Raio: {RAIO:.0f} km", file=sys.stderr)
print("Baixando dataset IBGE...", file=sys.stderr)
data = urllib.request.urlopen(URL, timeout=60).read().decode("utf-8")
rows = list(csv.DictReader(io.StringIO(data)))
print(f"Total municipios BR: {len(rows)}", file=sys.stderr)

dentro, por_uf, capitais = [], {}, []
for r in rows:
    try:
        lat = float(r["latitude"]); lon = float(r["longitude"])
    except (ValueError, KeyError):
        continue
    d = hav(lat, lon)
    if d <= RAIO:
        uf = UF.get(int(r["codigo_uf"]), "??")
        dentro.append((r["nome"], uf, d))
        por_uf[uf] = por_uf.get(uf, 0) + 1
        if str(r.get("capital","")).strip() in ("1","True","true"):
            capitais.append((r["nome"], uf, d))

dentro.sort(key=lambda x: x[2])
print(f"\n=== MUNICIPIOS DENTRO DE {RAIO:.0f} km: {len(dentro)} ===")
print("\nPor UF:")
for uf, n in sorted(por_uf.items(), key=lambda x: -x[1]):
    print(f"  {uf}: {n}")
print(f"\nCapitais no raio: {', '.join(f'{n}-{u} ({d:.0f}km)' for n,u,d in sorted(capitais, key=lambda x:x[2]))}")
print(f"\nMais proximo: {dentro[0][0]}-{dentro[0][1]} ({dentro[0][2]:.0f}km)")
print(f"Mais distante incluido: {dentro[-1][0]}-{dentro[-1][1]} ({dentro[-1][2]:.0f}km)")
