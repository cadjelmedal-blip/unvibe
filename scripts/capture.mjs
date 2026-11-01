#!/usr/bin/env node
/*
 * capture.mjs — before/after screenshots and a console check, with headless Chrome. No dependency (Node 22+).
 *
 *   Element shots (every [data-shot] on a page, 2x):
 *     node scripts/capture.mjs shots <url-or-file> <out-dir>
 *
 *   Screens of your app (full viewport, console errors and warnings, hydration included):
 *     node scripts/capture.mjs screens <base-url> <out-dir> <screens.json> [cookies.json]
 *     screens.json: [{ "url": "/settings", "name": "settings", "click": ["Advanced"], "scroll": true, "openMenu": 1 }]
 *     cookies.json: [{ "name": "session", "value": "…" }]   (to be signed in; never commit it)
 *
 * Clicks are real pointer gestures (move, press, release): React Aria and most menus ignore synthetic clicks.
 * Run it on production (before) and on your local branch (after) with the same screens.json, then build the
 * side-by-side page with scripts/compare.mjs.
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const [, , mode, target, outDir = "screenshots", screensFile, cookiesFile] = process.argv;
if (!["shots", "screens"].includes(mode) || !target) {
  console.error("usage: capture.mjs shots <url|file> <out>  |  capture.mjs screens <base> <out> <screens.json> [cookies.json]");
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

const CHROME = process.env.CHROME_PATH || [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser",
].find((p) => existsSync(p));
if (!CHROME) { console.error("Chrome not found: set CHROME_PATH."); process.exit(1); }

const PORT = 9300 + Math.floor(Math.random() * 400);
const profile = mkdtempSync(join(tmpdir(), "unvibe-"));
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "--hide-scrollbars", "--window-size=1440,1000", "--lang=en-US"], { stdio: "ignore" });
const cleanup = () => { try { chrome.kill(); rmSync(profile, { recursive: true, force: true }); } catch {} };
process.on("exit", cleanup);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let wsUrl;
for (let i = 0; i < 200 && !wsUrl; i++) { try { wsUrl = (await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json()).webSocketDebuggerUrl; } catch { await sleep(150); } }
const ws = new WebSocket(wsUrl);
await new Promise((ok, ko) => { ws.onopen = ok; ws.onerror = ko; });
let seq = 0; const pending = new Map(); const logs = [];
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d.result ?? {}); pending.delete(d.id); }
  else if (d.method === "Runtime.exceptionThrown") logs.push("exception: " + String(d.params.exceptionDetails?.exception?.description ?? d.params.exceptionDetails?.text).slice(0, 300));
  else if (d.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(d.params.type)) logs.push(d.params.type + ": " + d.params.args.map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 300));
};
const send = (method, params = {}, sessionId) => new Promise((ok) => { const id = ++seq; pending.set(id, ok); ws.send(JSON.stringify({ id, method, params, sessionId })); });
const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
const s = (m, p) => send(m, p, sessionId);
await s("Page.enable"); await s("Runtime.enable"); await s("Network.enable");
await s("Emulation.setLocaleOverride", { locale: process.env.LOCALE || "en-US" });
const evaluate = async (expression) => (await s("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result?.value;
const waitFor = async (expression, ms = 30000) => { for (let t = 0; t < ms; t += 250) { if (await evaluate(expression)) return true; await sleep(250); } return false; };
const pointer = async (expression) => {
  const box = await evaluate(`(() => { const el = ${expression}; if (!el) return null; el.scrollIntoView({ block: "center" }); const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`);
  if (!box) { console.log("  not found:", expression.slice(0, 120)); return false; }
  await sleep(200);
  for (const type of ["mouseMoved", "mousePressed", "mouseReleased"]) await s("Input.dispatchMouseEvent", { type, x: box.x, y: box.y, button: "left", buttons: type === "mousePressed" ? 1 : 0, clickCount: type === "mouseMoved" ? 0 : 1 });
  return true;
};
const toUrl = (t) => (/^https?:|^file:/.test(t) ? t : pathToFileURL(resolve(t)).href);

if (mode === "shots") {
  await s("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 2, mobile: false });
  await s("Page.navigate", { url: toUrl(target) });
  await waitFor("document.readyState === 'complete'");
  await evaluate("document.fonts ? document.fonts.ready.then(() => true) : true");
  await sleep(800);
  const shots = await evaluate(`[...document.querySelectorAll('[data-shot]')].map(e => e.dataset.shot)`);
  for (const name of shots) {
    const r = await evaluate(`(() => { const e = document.querySelector('[data-shot="${name}"]'); e.scrollIntoView({ block: "start" }); const b = e.getBoundingClientRect(); return { x: b.x + scrollX, y: b.y + scrollY, width: b.width, height: b.height }; })()`);
    await sleep(300);
    const { data } = await s("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { ...r, scale: 1 } });
    writeFileSync(join(outDir, `${name}.png`), Buffer.from(data, "base64"));
    console.log("shot", name);
  }
} else {
  const screens = JSON.parse(readFileSync(screensFile, "utf8"));
  if (cookiesFile) for (const c of JSON.parse(readFileSync(cookiesFile, "utf8"))) await s("Network.setCookie", { ...c, url: target, path: c.path ?? "/" });
  await s("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  for (const sc of screens) {
    logs.length = 0;
    await s("Page.navigate", { url: new URL(sc.url, target).href });
    await waitFor("document.readyState === 'complete'", 60000);
    await sleep(sc.wait ?? 2500);
    for (const label of sc.click ?? []) {
      await pointer(`[...document.querySelectorAll('main button, main a, main [role=tab], main summary, button, a')].find(b => b.textContent.trim() === ${JSON.stringify(label)} || b.getAttribute('aria-label') === ${JSON.stringify(label)})`);
      await sleep(1500);
    }
    if (sc.scroll) { await evaluate("window.scrollTo(0, document.body.scrollHeight)"); await sleep(600); }
    if (sc.openMenu) { await pointer(`document.querySelectorAll('[aria-haspopup="listbox"], [aria-haspopup="menu"]')[${sc.openMenu - 1}]`); await sleep(600); }
    const counts = await evaluate(`({ nativeSelects: document.querySelectorAll('select:not([tabindex="-1"])').length, unnamedMenus: [...document.querySelectorAll('[aria-haspopup="listbox"]')].filter(b => !b.getAttribute('aria-label') && !b.getAttribute('aria-labelledby')).length })`);
    const { data } = await s("Page.captureScreenshot", { format: "png" });
    writeFileSync(join(outDir, `${sc.name}.png`), Buffer.from(data, "base64"));
    console.log(sc.name, JSON.stringify(counts), "console:", logs.length ? logs : "clean");
  }
}
cleanup();
process.exit(0);
