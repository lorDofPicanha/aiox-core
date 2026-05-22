// Transcribe audio via OpenAI Whisper API
const https = require('https');
const fs = require('fs');
const path = require('path');

// Simple .env parser (no dotenv dep)
const envText = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
});
const API_KEY = env.OPENAI_API_KEY;
const audioPath = process.argv[2];

if (!API_KEY) { console.error('Missing OPENAI_API_KEY'); process.exit(1); }
if (!audioPath || !fs.existsSync(audioPath)) { console.error('Audio file not found:', audioPath); process.exit(1); }

const audioBuffer = fs.readFileSync(audioPath);
const fileName = path.basename(audioPath);
const boundary = '----WhisperBoundary' + Math.random().toString(36).slice(2);

// Build multipart body
const lineBreak = '\r\n';
const parts = [];
// file part
parts.push(Buffer.from(`--${boundary}${lineBreak}Content-Disposition: form-data; name="file"; filename="${fileName}"${lineBreak}Content-Type: audio/ogg${lineBreak}${lineBreak}`));
parts.push(audioBuffer);
parts.push(Buffer.from(lineBreak));
// model
parts.push(Buffer.from(`--${boundary}${lineBreak}Content-Disposition: form-data; name="model"${lineBreak}${lineBreak}whisper-1${lineBreak}`));
// language
parts.push(Buffer.from(`--${boundary}${lineBreak}Content-Disposition: form-data; name="language"${lineBreak}${lineBreak}pt${lineBreak}`));
// response_format
parts.push(Buffer.from(`--${boundary}${lineBreak}Content-Disposition: form-data; name="response_format"${lineBreak}${lineBreak}verbose_json${lineBreak}`));
// closing
parts.push(Buffer.from(`--${boundary}--${lineBreak}`));

const body = Buffer.concat(parts);

const opts = {
  method: 'POST',
  hostname: 'api.openai.com',
  path: '/v1/audio/transcriptions',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': body.length,
  },
};

const req = https.request(opts, (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    try {
      const j = JSON.parse(d);
      if (j.error) { console.error('API error:', j.error); process.exit(1); }
      console.log('=== TRANSCRIÇÃO ===');
      console.log(j.text);
      console.log('\n=== METADATA ===');
      console.log('language:', j.language, '| duration:', j.duration?.toFixed(1), 's');
      // Save JSON
      const out = audioPath.replace(/\.[^.]+$/, '-transcript.json');
      fs.writeFileSync(out, JSON.stringify(j, null, 2));
      console.log('\nSaved to:', out);
    } catch (e) {
      console.error('Parse err:', e.message, '\nRaw:', d.slice(0, 500));
    }
  });
});
req.on('error', e => console.error('Req err:', e.message));
req.write(body);
req.end();
