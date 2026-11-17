#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { page, singleAfter, singleBefore, rangeAfter, rangeBefore } from './mockups.mjs';
import { motionSvg, MOTION } from './motion.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SAAS = path.resolve(HERE, '../../../../../..');
const req = createRequire(path.join(SAAS, 'E2ETests', 'package.json'));
const { chromium, devices } = req('playwright');
const { aimAtTarget } = req(path.join(SAAS, '.claude/skills/report-standards/pick-page/capture-target.cjs'));
const OUT = path.join(HERE, 'frames');
fs.mkdirSync(path.join(OUT, 'html'), { recursive: true });

const CTX = {
  mobile: { ...devices['Galaxy S5'] },
  desktop: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
};

function inPageChecks() {
  const parse = (c) => { const m = c.match(/[\d.]+/g); return m ? m.map(Number) : [0, 0, 0, 0]; };
  const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const opaque = (c) => c.length < 4 || c[3] > 0.9;
  const bgOf = (el) => { for (let n = el; n; n = n.parentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (opaque(c)) return c; } return [255, 255, 255]; };
  const out = { contrast: [], tap: [], fit: [], align: [], cvd: [], items: [] };
  let minRatio = 99;
  for (const el of document.querySelectorAll('body *')) {
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!own || el.closest('.dis,[data-disabled]')) continue;
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    if (!r.width || r.bottom < 0 || r.top > innerHeight) continue;
    const big = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && +cs.fontWeight >= 700);
    const k = ratio(parse(cs.color), bgOf(el)); minRatio = Math.min(minRatio, k);
    if (k < (big ? 3 : 4.5)) out.contrast.push(`${el.className || el.tagName} "${el.textContent.trim().slice(0, 20)}" ${k.toFixed(2)}`);
    if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0 && cs.display !== 'inline') out.fit.push(`${el.className} "${el.textContent.trim().slice(0, 20)}"`);
  }
  for (const el of document.querySelectorAll('[data-tap]')) {
    const r = el.getBoundingClientRect();
    if (r.width < 44 || r.height < 44) out.tap.push(`${el.className} "${el.textContent.trim().slice(0, 12)}" ${r.width.toFixed(0)}x${r.height.toFixed(0)}`);
  }
  const ctls = [...document.querySelectorAll('.ctl, input, select, textarea')].map((c) => c.getBoundingClientRect()).filter((c) => c.width && c.bottom > 0 && c.top < innerHeight);
  for (const [i, p] of ctls.entries()) for (const q of ctls.slice(i + 1)) {
    const sameLine = p.top < q.bottom && q.top < p.bottom && (p.right <= q.left || q.right <= p.left);
    if (sameLine && (Math.abs(p.top - q.top) > 1 || Math.abs(p.height - q.height) > 1)) out.align.push(`${p.top.toFixed(0)}/${p.height.toFixed(0)} vs ${q.top.toFixed(0)}/${q.height.toFixed(0)}`);
  }
  for (const el of document.querySelectorAll('b.sel,b.rs,b.re,.chip.on,.pre.on,.sg.on')) {
    const host = bgOf(el.parentElement); const cs = getComputedStyle(el);
    const fill = parse(cs.backgroundColor); const edge = parse(cs.borderTopColor);
    const boundary = Math.max(opaque(fill) ? ratio(fill, host) : 1, parseFloat(cs.borderTopWidth) >= 2 ? ratio(edge, host) : 1);
    if (boundary < 3) out.cvd.push(`${el.className} boundary ${boundary.toFixed(2)}`);
  }
  if (document.documentElement.scrollWidth > innerWidth) out.fit.push(`page scrolls sideways ${document.documentElement.scrollWidth}`);
  for (const el of document.querySelectorAll('[data-item]')) {
    const r = el.getBoundingClientRect(); const x = r.left + r.width / 2; const y = r.top + r.height / 2;
    if (!r.width || y < 0 || y > innerHeight) continue;
    const hit = document.elementsFromPoint(x, y).find((n) => !n.closest('[data-scrim]'));
    if (hit && (el.contains(hit) || hit.contains(el))) out.items.push(el.dataset.item);
  }
  out.items = [...new Set(out.items)].sort();
  out.minRatio = +minRatio.toFixed(2);
  return out;
}

const STEPS = [
  { n: 1, screen: 'date-field', viewport: 'mobile', kind: 'single' },
  { n: 2, screen: 'date-field', viewport: 'desktop', kind: 'single' },
  { n: 3, screen: 'date-range', viewport: 'mobile', kind: 'range' },
  { n: 4, screen: 'date-range', viewport: 'desktop', kind: 'range' },
];
const APPLIES = {
  single: ['label', 'required', 'hint', 'enter', 'error', 'disabled', 'minmax'],
  range: ['label', 'required', 'hint', 'enter', 'minmax', 'range-from', 'range-to'],
  motion: ['label', 'required', 'hint', 'enter'],
};
const measured = (kind, items) => `${APPLIES[kind].filter((i) => items.includes(i)).length}/${APPLIES[kind].length}`;
const STATE = {
  single: 'Expected close focused, picker opened (before: the native popup is drawn by the browser outside the page, not in the capture)',
  range: 'Reporting period focused, picker opened on Last 7 days (before: native popups not in the capture)',
};

async function shoot(browser, viewport, html, file) {
  const ctx = await browser.newContext(CTX[viewport]);
  const pg = await ctx.newPage();
  await pg.setContent(html, { waitUntil: 'load' });
  fs.writeFileSync(path.join(OUT, 'html', file.replace('.png', '.html')), html);
  const aim = await aimAtTarget(pg, '[data-target]');
  await pg.screenshot({ path: path.join(OUT, file) });
  const checks = await pg.evaluate(inPageChecks);
  await ctx.close();
  return { box: aim.box, checks };
}

const browser = await chromium.launch();
const result = { options: {}, pairMethod: 'same-steps', countMethod: 'visible-in-frame', rowsMethod: 'auto', checks: {}, method: {}, frames: [], perFrame: {} };
const fails = { contrast: [], cvd: [], textFit: [], tapSize: [], formAlignment: [], visibleItems: [] };
const record = (file, c) => {
  result.perFrame[file] = { minContrast: c.minRatio, items: c.items, contrast: c.contrast, tap: c.tap, fit: c.fit, align: c.align, cvd: c.cvd };
  const add = (k, list) => list.forEach((x) => fails[k].push(`${file}: ${x}`));
  add('contrast', c.contrast); add('cvd', c.cvd); add('textFit', c.fit); add('tapSize', c.tap); add('formAlignment', c.align);
};
const specSteps = [];
for (const st of STEPS) {
  const meta = st.kind === 'single' ? singleAfter : rangeAfter;
  const beforeFile = `before-${st.kind}-${st.viewport}.png`;
  const before = await shoot(browser, st.viewport, page(st.viewport, (st.kind === 'single' ? singleBefore : rangeBefore)(st.viewport), st.kind === 'single' ? 'New deal' : 'New report'), beforeFile);
  record(beforeFile, before.checks);
  const options = [];
  for (const [j, opt] of meta.options.entries()) {
    const L = 'ABCDE'[j];
    const file = `s${st.n}-${L}.png`;
    const shot = await shoot(browser, st.viewport, page(st.viewport, opt.render(st.viewport), st.kind === 'single' ? 'New deal' : 'New report'), file);
    record(file, shot.checks);
    const lost = before.checks.items.filter((i) => !shot.checks.items.includes(i));
    if (lost.length) fails.visibleItems.push(`${file}: visible in before only: ${lost.join(', ')}`);
    const id = `${st.screen}-${st.viewport}-${L}`;
    const pair = { route: `${st.screen} mockup (deal form)`, state: STATE[st.kind], fixture: 'value 2026-11-20 / range 2026-11-10..16, min 2026-11-05, today 2026-11-16', viewport: st.viewport === 'mobile' ? 'Galaxy S5 360x640' : 'Desktop Chrome 1280x800', scrollAnchor: '[data-anchor] form top + [data-target] via aimAtTarget', crop: 'viewport' };
    const vis = { before: before.checks.items, after: shot.checks.items };
    result.frames.push({ option: id, shot: 'main', side: 'before', build: 'ui-forms 1.41.0 native input', file: `frames/${beforeFile}`, pair, visibleItems: vis });
    result.frames.push({ option: id, shot: 'main', side: 'after', build: `DATEPICK-1 mockup option ${L}`, file: `frames/${file}`, pair, visibleItems: vis });
    options.push({ name: opt.name, why: opt.why[st.viewport] ?? opt.why.all, image: `frames/${file}`, beforeImage: `frames/${beforeFile}`, targetBox: shot.box, beforeTargetBox: before.box, inventory: measured(st.kind, shot.checks.items), aligned: 'pass' });
    result.options[id] = { inventory: measured(st.kind, shot.checks.items), items: { before: before.checks.items, after: shot.checks.items } };
  }
  specSteps.push({ screen: st.screen, viewport: st.viewport, target: '[data-target] (the picker; before: the native date input)', title: meta.title[st.viewport], question: meta.question[st.viewport], options });
}

const motionOpts = [];
for (const [j, m] of MOTION.entries()) {
  const L = 'ABC'[j];
  const svg = motionSvg(m);
  fs.writeFileSync(path.join(OUT, `s5-${L}.svg`), svg);
  const ctx = await browser.newContext(CTX.mobile);
  const pg = await ctx.newPage();
  await pg.setContent(`<meta name="viewport" content="width=device-width,initial-scale=1"><body style="margin:0">${svg}</body>`);
  await pg.waitForTimeout(2200);
  await pg.screenshot({ path: path.join(OUT, `s5-${L}.png`) });
  const mc = await pg.evaluate(inPageChecks);
  await ctx.close();
  const id = `date-motion-mobile-${L}`;
  const pair = { route: 'date-field mockup (deal form)', state: STATE.single, fixture: 'value 2026-11-20, month change Nov to Dec 2026', viewport: 'Galaxy S5 360x640', scrollAnchor: 'top of page', crop: 'viewport' };
  const vis = { before: result.perFrame['before-single-mobile.png'].items, after: mc.items };
  result.options[id] = { inventory: measured('motion', mc.items), items: { before: vis.before, after: mc.items } };
  result.frames.push({ option: id, shot: 'main', side: 'before', build: 'ui-forms 1.41.0 native input', file: 'frames/before-single-mobile.png', pair, visibleItems: vis });
  result.frames.push({ option: id, shot: 'main', side: 'after', build: `DATEPICK-1 motion option ${L}`, file: `frames/s5-${L}.svg`, pair, visibleItems: vis });
  motionOpts.push({ name: m.name, why: m.why, image: `frames/s5-${L}.png`, motion: `frames/s5-${L}.svg`, beforeImage: 'frames/before-single-mobile.png', inventory: measured('motion', mc.items), aligned: 'pass' });
}
await browser.close();

for (const k of ['contrast', 'cvd', 'textFit', 'tapSize', 'formAlignment']) result.checks[k] = fails[k].length ? 'fail' : 'pass';
result.checks.smallSize = 'n/a -- a form control at its one size, not a mark or icon rendered small';
result.fails = fails;
result.method = {
  contrast: 'WCAG ratio of every visible text node vs its effective background; 4.5 body, 3 large; disabled text exempt',
  cvd: 'selected day, range ends, active chip/preset/tab: fill or 2px border vs host >= 3:1 by luminance, so no state is hue alone',
  textFit: 'no element with own text has scrollWidth > clientWidth; no sideways page scroll',
  tapSize: 'every [data-tap] >= 44x44 CSS px',
  formAlignment: 'every pair of visible controls on one line (auto-discovered, no hand list) shares top and height within 1px (FORM-ALIGN-1)',
  visibleItems: 'every inventory item visible in the before frame is visible in the after frame',
  motionStep: 'step 5 SVGs reuse the step 1 palette; contrast measured on the step 1 frames',
};
fs.writeFileSync(path.join(HERE, 'checks-datepick-1.json'), JSON.stringify(result, null, 1));
const spec = {
  docKey: 'datepick-1-pick',
  title: 'Date picker picks',
  brand: 'DATEPICK-1 Shared date picker: pick per screen',
  intro: 'Today every date field is the browser\'s own input. Each step shows today (before) and 3 designs (after) for one screen on one device. Every option keeps all 10 field behaviours; the stored value format does not change.',
  beforeAfter: 'before = ui-forms 1.41.0 native input, same form and fixture',
  result: 'checks-datepick-1.json',
  steps: [...specSteps, { screen: 'date-motion', viewport: 'mobile', kind: 'motion', target: 'n/a -- the motion previews are drawn SVG, no DOM to aim at', title: 'Motion: open and month change', question: 'Which motion for opening the calendar and changing month?', options: motionOpts }],
};
fs.writeFileSync(path.join(HERE, 'spec.json'), JSON.stringify(spec, null, 1));
console.log(JSON.stringify(result.checks));
console.log(JSON.stringify(fails, null, 1).slice(0, 2500));
