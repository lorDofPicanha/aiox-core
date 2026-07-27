#!/usr/bin/env bash
# Loop de 20 em 20 — Site-Prospector rodada nacional.
# uso: bash run-lote.sh <n>     (n = 1..5)
set -e
N="$1"
[ -z "$N" ] && { echo "uso: bash run-lote.sh <1..5>"; exit 1; }

SP="C:/Users/kingp/AppData/Local/Temp/claude/D--AIOS/9a2c5454-f257-460b-a152-9bef26817282/scratchpad"
INI=$(( (N-1) * 20 ))

cd /d/jarvis && set -a && . ./apify.env 2>/dev/null && set +a
TOK="${APIFY_TOKEN:-$APIFY_API_TOKEN}"

echo "=== LOTE $N (clientes $((INI+1))-$((INI+20))) ==="

# 1) recorta o lote e monta o payload
node -e "
const fs=require('fs');
const t=require('$SP/final100.json');
const lote=t.slice($INI,$INI+20).map(r=>({
  brand:r.brand, ig:(r.ig||'').replace('@',''), nicho:r.nicho,
  followers:r.followers, posts:r.posts, lacuna:r.lacunaTipo,
  evidencia:r.evidencia, site:r.site, bioLink:r.bioLink
}));
fs.writeFileSync('$SP/lote$N.json',JSON.stringify(lote,null,1));
fs.writeFileSync('$SP/ig-posts-payload$N.json',JSON.stringify({
  directUrls: lote.map(x=>'https://www.instagram.com/'+x.ig+'/'),
  resultsType:'posts', resultsLimit:30, addParentData:false
}));
console.log('perfis no lote:',lote.length);
"

# 2) dispara o scraper de posts
R=$(curl -s -X POST "https://api.apify.com/v2/acts/apify~instagram-scraper/runs?token=$TOK" \
  -H "Content-Type: application/json" -d @"$SP/ig-posts-payload$N.json" \
  | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const j=JSON.parse(s);console.log(j.data.id+' '+j.data.defaultDatasetId)})")
set -- $R; RID=$1; DS=$2
echo "run apify: $RID"

# 3) aguarda
for i in $(seq 1 200); do
  ST=$(curl -s "https://api.apify.com/v2/actor-runs/$RID?token=$TOK" \
    | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.parse(s).data.status))")
  if [ "$ST" != "RUNNING" ] && [ "$ST" != "READY" ]; then echo "status: $ST"; break; fi
  sleep 15
done

# 4) puxa o dataset
curl -s "https://api.apify.com/v2/datasets/$DS/items?token=$TOK&clean=true" -o "$SP/lote$N-posts.json"
node -e "console.log('posts:',require('$SP/lote$N-posts.json').length)"

# 5) monta as pastas + baixa as fotos
node "$SP/build-lote.cjs" "$N"

echo "=== LOTE $N CONCLUIDO ==="
