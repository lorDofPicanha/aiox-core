#!/usr/bin/env tsx
/**
 * Google OAuth helper — gera refresh_token pra Google Ads API.
 * Roda 1× durante setup. Salva o refresh_token em .env.local.
 *
 * Pré-requisitos:
 *   - GCP Console → API → Credentials → OAuth client (Web application)
 *   - Authorized redirect URI: http://localhost:8123/callback
 *   - GOOGLE_ADS_CLIENT_ID + GOOGLE_ADS_CLIENT_SECRET em .env.local
 *
 * Uso:
 *   pnpm google:oauth
 *   → abre URL no browser, autoriza, redireciona pra localhost:8123, exibe refresh_token
 */

import { createServer } from 'node:http';
import { URL } from 'node:url';

const PORT = 8123;
const REDIRECT = `http://localhost:${PORT}/callback`;
const SCOPE = 'https://www.googleapis.com/auth/adwords';

async function main() {
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('GOOGLE_ADS_CLIENT_ID + GOOGLE_ADS_CLIENT_SECRET required em .env.local');
    process.exit(1);
  }

  // 1. Build auth URL
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', REDIRECT);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', SCOPE);
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent'); // força refresh_token novo

  console.log('\n1. Abre essa URL no browser:\n');
  console.log(authUrl.toString());
  console.log('\n2. Autoriza acesso (use conta com permissão no Google Ads MCC).');
  console.log(`3. Vai redirecionar pra ${REDIRECT} — server local capturará o code.\n`);

  // 2. Wait pra callback
  const code = await new Promise<string>((resolve, reject) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
      if (url.pathname !== '/callback') {
        res.writeHead(404).end('not found');
        return;
      }
      const code = url.searchParams.get('code');
      const error = url.searchParams.get('error');

      if (error) {
        res.writeHead(400).end(`Error: ${error}. Volta pro terminal.`);
        server.close();
        reject(new Error(error));
        return;
      }

      if (!code) {
        res.writeHead(400).end('Missing code');
        return;
      }

      res.writeHead(200).end('Auth OK. Pode fechar a aba.');
      server.close();
      resolve(code);
    });

    server.listen(PORT, () => {
      console.log(`→ Aguardando callback em :${PORT}...\n`);
    });

    setTimeout(() => {
      server.close();
      reject(new Error('OAuth timeout 5min'));
    }, 5 * 60 * 1000);
  });

  // 3. Trade code → refresh_token
  console.log('▶ Trocando code por refresh_token...');
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECT,
      grant_type: 'authorization_code',
    }),
  });
  const tokenJson = (await tokenRes.json()) as Record<string, unknown>;

  if (!tokenRes.ok) {
    console.error('Erro trocando code:', tokenJson);
    process.exit(1);
  }

  const refreshToken = tokenJson.refresh_token as string | undefined;
  if (!refreshToken) {
    console.error('refresh_token não retornado. Possíveis causas:');
    console.error('  - prompt=consent não funcionou');
    console.error('  - você já autorizou antes com a mesma conta');
    console.error('  - Tenta com outra conta OU revoga e tenta de novo');
    process.exit(1);
  }

  console.log('\n✓ Sucesso. Copia pro .env.local:\n');
  console.log(`GOOGLE_ADS_REFRESH_TOKEN=${refreshToken}\n`);
  console.log('Caveat: em modo "test" do GCP app, o refresh_token expira em ~7 dias.');
  console.log('Pra produção, submeta o app pra verification em console.cloud.google.com.\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
