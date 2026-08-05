const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn, spawnSync } = require("child_process");
const { pathToFileURL } = require("url");

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const loteArg = process.argv.find((argument) => /^--lote-\d+$/.test(argument));
const lote = loteArg ? loteArg.replace("--lote-", "").padStart(2, "0") : "01";
const batchName = lote === "01" ? "batch-2026-07" : `batch-2026-07-lote-${lote}`;
const batchRoot = path.resolve(__dirname, "..", "03-proposal-mockups", batchName);
const pageNames = ["index", "catalogo", "categoria", "produto", "sobre", "guia", "contato", "carrinho"];
const viewports = [
  { name: "desktop", width: 1440, height: 900, mobile: false },
  { name: "mobile", width: 390, height: 844, mobile: true },
];
const port = 9333;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "site-prospector-edge-"));

if (!fs.existsSync(edgePath)) throw new Error(`Edge not found at ${edgePath}`);

const edge = spawn(edgePath, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--no-first-run",
  "--no-default-browser-check",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  "about:blank",
], { windowsHide: true, stdio: "ignore" });

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function jsonFetch(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

async function waitForEdge() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      return await jsonFetch(`http://127.0.0.1:${port}/json/version`);
    } catch {
      await delay(100);
    }
  }
  throw new Error("Edge CDP did not start");
}

class Cdp {
  constructor(url) {
    this.nextId = 1;
    this.pending = new Map();
    this.waiters = new Map();
    this.socket = new WebSocket(url);
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
      }
      if (message.method && this.waiters.has(message.method)) {
        const waiter = this.waiters.get(message.method);
        this.waiters.delete(message.method);
        waiter(message.params);
      }
    };
  }
  async open() {
    if (this.socket.readyState === WebSocket.OPEN) return;
    await new Promise((resolve, reject) => {
      this.socket.onopen = resolve;
      this.socket.onerror = reject;
    });
  }
  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }
  event(method, timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.waiters.delete(method);
        reject(new Error(`Timeout waiting for ${method}`));
      }, timeoutMs);
      this.waiters.set(method, (params) => {
        clearTimeout(timer);
        resolve(params);
      });
    });
  }
  close() {
    this.socket.close();
  }
}

async function main() {
  await waitForEdge();
  const target = await jsonFetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
  const cdp = new Cdp(target.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");

  const businesses = fs.readdirSync(batchRoot)
    .filter((name) => fs.existsSync(path.join(batchRoot, name, "site-v2", "manifest.json")));
  const audit = [];

  for (const business of businesses) {
    const siteRoot = path.join(batchRoot, business, "site-v2");
    const screenRoot = path.join(siteRoot, "screens");
    fs.mkdirSync(screenRoot, { recursive: true });
    for (const pageName of pageNames) {
      const fileUrl = pathToFileURL(path.join(siteRoot, `${pageName}.html`)).href;
      for (const viewport of viewports) {
        await cdp.send("Emulation.setDeviceMetricsOverride", {
          width: viewport.width,
          height: viewport.height,
          deviceScaleFactor: 1,
          mobile: viewport.mobile,
          screenWidth: viewport.width,
          screenHeight: viewport.height,
        });
        const loaded = cdp.event("Page.loadEventFired");
        await cdp.send("Page.navigate", { url: fileUrl });
        await loaded;
        await cdp.send("Runtime.evaluate", {
          expression: "document.fonts.ready",
          awaitPromise: true,
          returnByValue: true,
        });
        await delay(80);
        const metrics = await cdp.send("Page.getLayoutMetrics");
        const size = metrics.cssContentSize || metrics.contentSize;
        const overflow = await cdp.send("Runtime.evaluate", {
          expression: "({scrollWidth:document.documentElement.scrollWidth,innerWidth:window.innerWidth,label:document.body.innerText.includes('Conceito visual não oficial')})",
          returnByValue: true,
        });
        const shot = await cdp.send("Page.captureScreenshot", {
          format: "jpeg",
          quality: 84,
          captureBeyondViewport: true,
          fromSurface: true,
          clip: { x: 0, y: 0, width: size.width, height: size.height, scale: 1 },
        });
        fs.writeFileSync(
          path.join(screenRoot, `${pageName}-${viewport.name}.jpg`),
          Buffer.from(shot.data, "base64"),
        );
        audit.push({
          business,
          page: pageName,
          viewport: viewport.name,
          width: size.width,
          height: size.height,
          horizontalOverflow: overflow.result.value.scrollWidth > overflow.result.value.innerWidth + 1,
          labelPresent: overflow.result.value.label,
        });
      }
    }
  }

  cdp.close();
  const failures = audit.filter((item) => item.horizontalOverflow || !item.labelPresent);
  const report = {
    generatedAt: new Date().toISOString(),
    captures: audit.length,
    expectedCaptures: businesses.length * pageNames.length * viewports.length,
    failures,
    pass: audit.length === businesses.length * pageNames.length * viewports.length && failures.length === 0,
    audit,
  };
  fs.writeFileSync(path.join(batchRoot, "site-v2-visual-audit.json"), JSON.stringify(report, null, 2));
  process.stdout.write(`${JSON.stringify({ captures: report.captures, failures: failures.length, pass: report.pass }, null, 2)}\n`);
  if (!report.pass) process.exitCode = 1;
}

main()
  .catch((error) => {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (edge.pid) {
      spawnSync("taskkill", ["/PID", String(edge.pid), "/T", "/F"], {
        windowsHide: true,
        stdio: "ignore",
      });
    }
    const tempRoot = path.resolve(os.tmpdir());
    const resolvedProfile = path.resolve(profile);
    if (resolvedProfile.startsWith(`${tempRoot}${path.sep}site-prospector-edge-`)) {
      for (let attempt = 0; attempt < 8; attempt += 1) {
        try {
          fs.rmSync(resolvedProfile, { recursive: true, force: true, maxRetries: 2, retryDelay: 150 });
          break;
        } catch (error) {
          if (attempt === 7) throw error;
          await new Promise((resolve) => setTimeout(resolve, 350));
        }
      }
    }
  });
