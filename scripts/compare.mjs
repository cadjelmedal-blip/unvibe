#!/usr/bin/env node
/*
 * compare.mjs — one local page with every before/after pair side by side.
 *
 *   node scripts/compare.mjs <before-dir> <after-dir> <out.html> ["Title"]
 *
 * Pairs are matched by file name. Show only differences a person can SEE: if a pair looks identical at
 * a glance, it does not belong in the page (or the change is not done yet).
 */
import { readdirSync, writeFileSync } from "node:fs";
import { basename, relative, dirname, resolve } from "node:path";

const [, , beforeDir, afterDir, out = "compare.html", title = "Before / after"] = process.argv;
if (!beforeDir || !afterDir) { console.error("usage: compare.mjs <before-dir> <after-dir> <out.html> [title]"); process.exit(1); }
const pngs = (d) => readdirSync(d).filter((f) => f.endsWith(".png")).sort();
const after = new Set(pngs(afterDir));
const pairs = pngs(beforeDir).filter((f) => after.has(f));
const rel = (d, f) => relative(dirname(resolve(out)), resolve(d, f));
const esc = (t) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const html = `<!doctype html><meta charset="utf-8"><title>${esc(title)}</title>
<style>body{margin:0;background:#F6F4EE;color:#203A33;font:15px/1.5 Inter,system-ui,sans-serif}header{padding:28px 32px 8px}h1{margin:0;font:800 32px/1.1 "Inter Tight",Inter,sans-serif;letter-spacing:-.04em}section{padding:18px 32px;border-top:1px solid #E4E0D6}h2{margin:0 0 10px;font:600 16px/1.3 Inter,sans-serif}.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}figure{margin:0}figcaption{margin-bottom:6px;font-size:12.5px;font-weight:500;color:#5E6864}img{display:block;width:100%;border:1px solid #E4E0D6;border-radius:10px}</style>
<header><h1>${esc(title)}</h1><p>${pairs.length} pairs. Before on the left, after on the right.</p></header>
${pairs.map((f) => `<section><h2>${esc(basename(f, ".png"))}</h2><div class="pair"><figure><figcaption>Before</figcaption><img src="${rel(beforeDir, f)}" alt=""></figure><figure><figcaption>After</figcaption><img src="${rel(afterDir, f)}" alt=""></figure></div></section>`).join("\n")}`;
writeFileSync(out, html);
console.log(`${pairs.length} pairs → ${out}`);
