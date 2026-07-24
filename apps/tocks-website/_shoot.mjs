import { chromium } from '@playwright/test'
import fs from 'node:fs'

const BASE = process.argv[2] || 'http://localhost:3000'
const TAG = process.argv[3] || 'local'
const OUT = process.argv[4] || 'C:/Users/kingp/AppData/Local/Temp/claude/D--AIOS/27616ef3-6bc4-44a3-a9e2-7c8dd20799b3/scratchpad/shots'
fs.mkdirSync(OUT, { recursive: true })

const PAGES = [
  ['home', '/'],
  ['colecao', '/colecao'],
  ['produto-tenro', '/colecao/tenro-luxo'],
  ['produto-curve', '/colecao/curve'],
  ['atelier', '/atelier'],
  ['projetos', '/projetos'],
  ['contato', '/contato'],
  ['blog', '/blog'],
  ['blog-post', '/blog/como-escolher-mesa-sinuca'],
]

const VIEWPORTS = [
  ['m360', 360, 740],   // small android
  ['m390', 390, 844],   // iphone 12/13/14
  ['t768', 768, 1024],  // tablet
  ['d1440', 1440, 900], // desktop
]

const browser = await chromium.launch()
const report = []

for (const [vpName, w, h] of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  })
  const page = await ctx.newPage()
  const consoleErrors = []
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 160)) })
  page.on('pageerror', (e) => consoleErrors.push('PAGEERROR: ' + String(e).slice(0, 160)))

  for (const [pName, path] of PAGES) {
    const url = BASE + path
    let status = 'ok'
    try {
      const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
      status = resp ? resp.status() : 'no-resp'
    } catch (e) {
      report.push(`${vpName} ${pName} NAV-FAIL ${String(e).slice(0,80)}`)
      continue
    }
    await page.waitForTimeout(700)
    // overflow + banner metrics
    const metrics = await page.evaluate(() => {
      const de = document.documentElement
      const overflowX = de.scrollWidth - window.innerWidth
      // find elements wider than viewport (offenders)
      const offenders = []
      const all = document.querySelectorAll('body *')
      for (const el of all) {
        const r = el.getBoundingClientRect()
        if (r.width > window.innerWidth + 2 && r.height > 20) {
          const tag = el.tagName.toLowerCase()
          const cls = (el.className && typeof el.className === 'string') ? el.className.slice(0, 50) : ''
          offenders.push(`${tag}.${cls} w=${Math.round(r.width)} left=${Math.round(r.left)}`)
          if (offenders.length >= 4) break
        }
      }
      // element extending past right edge (cut off)
      const clipped = []
      for (const el of document.querySelectorAll('section, header, img, [class*="hero"], [class*="banner"], [class*="grid"]')) {
        const r = el.getBoundingClientRect()
        if (r.right > window.innerWidth + 2 || r.left < -2) {
          const tag = el.tagName.toLowerCase()
          const cls = (el.className && typeof el.className === 'string') ? el.className.slice(0, 40) : ''
          clipped.push(`${tag}.${cls} L=${Math.round(r.left)} R=${Math.round(r.right)}`)
          if (clipped.length >= 4) break
        }
      }
      return {
        scrollW: de.scrollWidth, innerW: window.innerWidth, overflowX,
        bodyH: document.body.scrollHeight,
        offenders, clipped,
      }
    })
    const flag = metrics.overflowX > 2 ? '  ⚠️OVERFLOW' : ''
    report.push(`${vpName} ${pName} status=${status} scrollW=${metrics.scrollW} innerW=${metrics.innerW} overflowX=${metrics.overflowX}${flag} bodyH=${metrics.bodyH}`)
    if (metrics.offenders.length) report.push(`    offenders: ${metrics.offenders.join(' | ')}`)
    if (metrics.clipped.length) report.push(`    clipped: ${metrics.clipped.join(' | ')}`)
    // screenshot full page
    await page.screenshot({ path: `${OUT}/${TAG}_${vpName}_${pName}.png`, fullPage: true })
  }
  if (consoleErrors.length) report.push(`${vpName} CONSOLE-ERRORS(${consoleErrors.length}): ${[...new Set(consoleErrors)].slice(0,6).join(' || ')}`)
  await ctx.close()
}

await browser.close()
const text = report.join('\n')
fs.writeFileSync(`${OUT}/REPORT_${TAG}.txt`, text)
console.log(text)
