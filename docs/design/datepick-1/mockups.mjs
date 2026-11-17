const TOKENS = `--bg:#FFFFFF;--surface:#F5F7FA;--raised:#FFFFFF;--text:#0D2340;--text2:#4A5A72;--border:#7F8DA3;--divider:#D7DDE6;--primary:#123159;--onp:#FFFFFF;--error:#B42318;--scrim:rgba(13,35,64,.40);--pop:0 24px 60px -16px rgba(13,21,38,.32)`;

export const CSS = `:root{${TOKENS}}
*{box-sizing:border-box;margin:0}
body{font:15px/1.4 "Segoe UI",system-ui,sans-serif;color:var(--text);background:var(--bg)}
.top{height:44px;display:flex;align-items:center;gap:8px;padding:0 12px;border-bottom:1px solid var(--divider);font-weight:600}
body.d .top{height:56px;padding:0 32px;gap:28px}
.top .nl{color:var(--text2);font-weight:400;font-size:14px}.top .nl.on{color:var(--text);font-weight:600}
main{padding:8px 16px 0}
body.d main{max-width:960px;margin:32px auto 0;padding:32px;border:1px solid var(--divider);border-radius:12px}
.ttl{font-size:22px;font-weight:700;line-height:28px;margin-bottom:20px}
.row{display:flex;gap:12px;margin-bottom:12px;align-items:flex-start}.row>.fld{flex:1;min-width:0}
body.d .row{gap:20px;margin-bottom:20px}.row.in{margin-bottom:0}
.fld{position:relative}.tgt{position:relative}
body.d .tgt.rng{max-width:420px}body.d .grp{max-width:520px}
.lbl{font-size:13px;font-weight:600;line-height:20px;margin-bottom:4px}.lbl.sm{font-weight:400;color:var(--text2)}
.req{color:var(--error)}
.ctl{height:48px;border:1px solid var(--border);border-radius:9px;background:var(--raised);display:flex;align-items:center;padding:0 0 0 12px;gap:6px;font-variant-numeric:tabular-nums;width:100%}
.ctl.focus{outline:2px solid var(--primary);outline-offset:1px}
.ctl.bad{border:2px solid var(--error)}
.ctl.dis{background:var(--surface);color:var(--text2);border-style:dashed}
.nat{display:block;padding:0 12px;font:inherit;color:var(--text)}
.val{flex:1;white-space:nowrap;overflow:hidden;min-width:0}
.seg{background:var(--primary);color:var(--onp);border-radius:4px;padding:1px 3px}
.ib{width:44px;height:44px;display:grid;place-items:center;border:0;background:none;color:var(--text);flex:none;border-radius:8px}
.ic{margin-right:12px;flex:none}
.hint{font-size:13px;color:var(--text2);line-height:20px;margin-top:4px}
.err{font-size:13px;color:var(--error);line-height:18px;margin-top:4px;display:flex;gap:4px;align-items:flex-start}.err svg{flex:none;margin-top:1px}
.pop{margin-top:8px;background:var(--raised);border:1px solid var(--divider);border-radius:12px;box-shadow:var(--pop);padding:8px}
.pop.abs{position:absolute;top:100%;right:0;width:340px;z-index:2}
.pop.wide{left:0;right:auto;width:auto;padding:12px}
.mhead{display:flex;align-items:center;justify-content:space-between;height:44px}
.mt{font-weight:700}.sp{width:44px}
.nb{width:44px;height:44px;border:0;background:none;display:grid;place-items:center;border-radius:8px;color:var(--text)}
.menus{display:flex;gap:2px}
.mb{height:44px;padding:0 8px;border:0;background:none;font:inherit;font-weight:700;display:inline-flex;align-items:center;gap:4px;color:var(--text);border-radius:8px}
.wk,.grid{display:grid;grid-template-columns:repeat(7,1fr)}
.wk span{font-size:12px;color:var(--text2);text-align:center;line-height:20px}
.cell{height:44px;display:grid;place-items:center;font-variant-numeric:tabular-nums}
.cell b{width:40px;height:40px;display:grid;place-items:center;border-radius:999px;font-weight:400}
.cell b.today{box-shadow:inset 0 0 0 2px var(--primary);font-weight:700}
.cell b.sel,.cell b.rs,.cell b.re{background:var(--primary);color:var(--onp);font-weight:700}
.cell b.dis{color:var(--text2);opacity:.5;text-decoration:line-through}
.cell.in{background:var(--divider)}
.cell.bs{background:linear-gradient(90deg,transparent 50%,var(--divider) 50%)}
.cell.be{background:linear-gradient(90deg,var(--divider) 50%,transparent 50%)}
.foot{display:flex;gap:8px;align-items:center;padding-top:8px;border-top:1px solid var(--divider);margin-top:4px}
.grow{flex:1}
.btn{height:44px;padding:0 16px;border-radius:9px;border:1px solid var(--border);background:var(--raised);font:inherit;font-weight:600;color:var(--text);white-space:nowrap;display:inline-flex;align-items:center;gap:4px}
.btn.p{background:var(--primary);border-color:var(--primary);color:var(--onp)}.btn.g{border-color:transparent}
.sum{font-size:14px;font-weight:600;font-variant-numeric:tabular-nums;white-space:nowrap}
.chips{display:flex;gap:6px;padding:4px 0}
.chip{height:44px;padding:0 10px;border:1px solid var(--border);border-radius:999px;background:var(--raised);font:inherit;font-size:13px;color:var(--text);display:inline-flex;align-items:center;gap:4px;white-space:nowrap}
.chip.on{border:2px solid var(--primary);font-weight:700}
body.d .chips{gap:8px;padding:0 0 8px}body.d .chip{padding:0 14px;font-size:14px}
.rail{width:160px;display:flex;flex-direction:column;gap:4px;padding-right:12px;border-right:1px solid var(--divider)}
.pre{height:44px;text-align:left;padding:0 10px;border:1px solid transparent;background:none;font:inherit;font-size:14px;border-radius:8px;color:var(--text);display:flex;align-items:center;gap:6px;white-space:nowrap}
.pre.on{border:2px solid var(--primary);font-weight:700}
.ra{display:flex;gap:16px}.months{display:flex;gap:24px}.mon{width:322px}
.scrim{position:fixed;inset:0;background:var(--scrim);z-index:3}
.sheet{position:fixed;left:0;right:0;bottom:0;background:var(--raised);border-radius:16px 16px 0 0;padding:0 12px 12px;z-index:4;box-shadow:var(--pop)}
.handle{width:36px;height:4px;border-radius:2px;background:var(--border);margin:8px auto 4px}
.shead{padding:4px 0 8px}
.srow{display:flex;gap:8px;align-items:center;height:52px}
.mlab{font-weight:700;line-height:28px;padding-left:4px}.peek{color:var(--text2)}
.segrow{display:flex;gap:8px;align-items:center;height:56px}
.sg{flex:1;height:48px;border:1px solid var(--border);border-radius:9px;background:var(--raised);display:flex;flex-direction:column;justify-content:center;padding:0 10px;text-align:left;font:inherit;font-size:14px;font-weight:600;color:var(--text)}
.sg small{font-size:11px;color:var(--text2);font-weight:400;line-height:14px}.sg.on{border:2px solid var(--primary)}`;

const MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const svg = (w, d, sw = 1.7) => `<svg width="${w}" height="${w}" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="${sw}" aria-hidden="true">${d}</svg>`;
const ICON = {
  cal: svg(20, '<rect x="3" y="4.5" width="14" height="12.5" rx="2"/><path d="M3 8.5h14M7 2.5v4M13 2.5v4"/>'),
  prev: svg(20, '<path d="M12.5 4.5 7 10l5.5 5.5"/>'),
  next: svg(20, '<path d="M7.5 4.5 13 10l-5.5 5.5"/>'),
  down: svg(14, '<path d="m5 8 5 5 5-5"/>', 2),
  alert: svg(16, '<circle cx="10" cy="10" r="8"/><path d="M10 5.5v5.5M10 14v.3"/>', 2),
  check: svg(14, '<path d="m4 10.5 4 4L16 6"/>', 2.4),
};
const key = (y, m, d) => y * 10000 + (m + 1) * 100 + d;
const SINGLE = { sel: 20261120, today: 20261116, min: 20261105 };
const RANGE = { rs: 20261110, re: 20261116, today: 20261116, max: 20261116 };
const PRE = ['Today', 'Last 7 days', 'This month', 'Quarter'];

function grid(y, m, o) {
  const lead = (new Date(Date.UTC(y, m, 1)).getUTCDay() + 6) % 7;
  const n = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const cells = Array.from({ length: lead }, () => '<span class="cell"></span>');
  let marked = false;
  for (let d = 1; d <= n; d += 1) {
    const k = key(y, m, d);
    const dis = (o.min && k < o.min) || (o.max && k > o.max);
    const cell = ['cell'];
    if (o.rs && k > o.rs && k < o.re) cell.push('in');
    if (k === o.rs) cell.push('bs');
    if (k === o.re) cell.push('be');
    const b = [k === o.sel && 'sel', k === o.rs && 'rs', k === o.re && 're', k === o.today && 'today', dis && 'dis'].filter(Boolean);
    const item = dis && !marked ? ' data-item="minmax"' : '';
    if (dis) marked = true;
    cells.push(`<span class="${cell.join(' ')}"${dis ? '' : ' data-tap'}><b class="${b.join(' ')}"${item}>${d}</b></span>`);
  }
  const wk = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((w) => `<span>${w}</span>`).join('');
  return `<div class="wk">${wk}</div><div class="grid">${cells.join('')}</div>`;
}

const navBtn = (dir) => `<button class="nb" data-tap aria-label="${dir === 'prev' ? 'Previous' : 'Next'} month">${ICON[dir]}</button>`;
function mhead(y, m, o = {}) {
  const mid = o.menus
    ? `<span class="menus"><button class="mb" data-tap>${MON[m]} ${ICON.down}</button><button class="mb" data-tap>${y} ${ICON.down}</button></span>`
    : `<span class="mt">${MON[m]} ${y}</span>`;
  return `<div class="mhead">${o.prev === false ? '<span class="sp"></span>' : navBtn('prev')}${mid}${o.next === false ? '<span class="sp"></span>' : navBtn('next')}</div>`;
}

const lbl = (t, req) => `<div class="lbl" data-item="label">${t}${req ? '<span class="req" data-item="required"> *</span>' : ''}</div>`;
const iconBtn = `<button class="ib" data-tap aria-label="Open calendar">${ICON.cal}</button>`;
const ctl = (inner, cls = '') => `<div class="ctl ${cls}">${inner}</div>`;
const singleHint = '<div class="hint" data-item="hint">When you expect to sign. <span data-item="enter">Enter saves.</span></div>';
const rangeHint = '<div class="hint" data-item="hint">Up to one quarter. <span data-item="enter">Enter applies.</span></div>';

function bookedOn(native) {
  const c = native
    ? '<input class="ctl nat dis" data-disabled data-item="disabled" type="date" value="2026-11-02" disabled>'
    : `<div class="ctl dis" data-disabled data-item="disabled"><span class="val">02 Nov 2026</span>${ICON.cal.replace('<svg', '<svg class="ic"')}</div>`;
  return `<div class="fld">${lbl('Booked on')}${c}<div class="hint">Set by the system.</div></div>`;
}
function valueDate(native) {
  const c = native ? '<input class="ctl nat bad" type="date" value="2026-11-28" aria-invalid="true">' : ctl(`<span class="val">28 Nov 2026</span>${iconBtn}`, 'bad');
  return `<div class="fld">${lbl('Value date', true)}${c}<div class="err" data-item="error">${ICON.alert}<span>On or after 01 Dec 2026.</span></div></div>`;
}
function expected(kind, extra = '') {
  const c = {
    native: '<input class="ctl nat" data-target type="date" value="2026-11-20" min="2026-11-05">',
    mask: ctl(`<span class="val"><span class="seg">20</span> / 11 / 2026</span>${iconBtn}`, 'focus'),
    seg: ctl(`<span class="val"><span class="seg">20</span> Nov 2026</span>${iconBtn}`, 'focus'),
  }[kind];
  return `<div class="fld tgt">${lbl('Expected close', true)}${c}${singleHint}${extra}</div>`;
}
const singleLayout = (vp, target, outside = '', native = false) => (vp === 'mobile'
  ? `<div class="row">${bookedOn(native)}${valueDate(native)}</div>${target}${outside}`
  : `<h1 class="ttl">New deal</h1><div class="row">${bookedOn(native)}${valueDate(native)}${target}</div>${outside}`);

export const page = (vp, body, title = "New deal") => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${CSS}</style></head><body class="${vp === 'mobile' ? 'm' : 'd'}">${vp === 'mobile'
  ? `<header class="top">${ICON.prev}<span>${title}</span></header>`
  : '<header class="top"><span>Workspace</span><span class="nl on">Deals</span><span class="nl">Tasks</span><span class="nl">Schedules</span><span class="nl">Imports</span></header>'}<main data-anchor>${body}</main></body></html>`;

const nov = (o) => grid(2026, 10, o);
const popCls = (vp) => `pop${vp === 'desktop' ? ' abs' : ''}`;
const clearToday = '<div class="foot"><button class="btn g" data-tap>Clear</button><span class="grow"></span><button class="btn g" data-tap>Today</button></div>';
const clearSet = '<div class="foot"><button class="btn g" data-tap>Clear</button><span class="grow"></span><button class="btn p" data-tap>Set date</button></div>';
const quick = `<div class="chips">${['Today', '+1 day', '+1 week', 'Month end'].map((c) => `<button class="chip" data-tap>${c}</button>`).join('')}</div>`;

export const singleBefore = (vp) => singleLayout(vp, expected('native'), '', true);
export const singleAfter = {
  title: { mobile: 'Date field on a phone', desktop: 'Date field on a computer' },
  question: { mobile: 'Which date picker on a phone?', desktop: 'Which date picker on a computer?' },
  options: [
    { name: 'Popover under the field', why: { all: 'Type day, month and year in place, or pick in a calendar that opens under the hint. Clear and Today in the footer.' },
      render: (vp) => singleLayout(vp, expected('seg', `<div class="${popCls(vp)}" data-target>${mhead(2026, 10)}${nov(SINGLE)}${clearToday}</div>`)) },
    { name: 'Month and year menus', why: { mobile: 'A bottom sheet with month and year menus for far dates, large day cells and Set date to confirm.', desktop: 'A popover with month and year menus for far dates and Set date to confirm.' },
      render: (vp) => (vp === 'mobile'
        ? singleLayout(vp, expected('seg'), `<div class="scrim" data-scrim></div><div class="sheet" data-target><div class="handle"></div><div class="shead">${lbl('Expected close', true)}${singleHint}</div>${mhead(2026, 10, { menus: true })}${nov(SINGLE)}${clearSet}</div>`)
        : singleLayout(vp, expected('seg', `<div class="pop abs" data-target>${mhead(2026, 10, { menus: true })}${nov(SINGLE)}${clearSet}</div>`))) },
    { name: 'Quick picks over the grid', why: { all: 'Typed as DD / MM / YYYY. Four quick picks (today, +1 day, +1 week, month end) sit above the calendar.' },
      render: (vp) => singleLayout(vp, expected('mask', `<div class="${popCls(vp)}" data-target>${quick}${mhead(2026, 10)}${nov(SINGLE)}</div>`)) },
  ],
};

const sum = '<span class="sum"><span data-item="range-from">10 Nov</span> – <span data-item="range-to">16 Nov 2026</span> · 7 days</span>';
const chipRow = (icon) => `<div class="chips">${PRE.map((p) => `<button class="chip${p === 'Last 7 days' ? ' on' : ''}" data-tap>${p === 'Last 7 days' && icon ? ICON.check : ''}${p}</button>`).join('')}</div>`;
const preBtns = PRE.map((p) => `<button class="pre${p === 'Last 7 days' ? ' on' : ''}" data-tap>${p === 'Last 7 days' ? ICON.check : ''}${p}</button>`).join('');
const twoMonths = `<div class="months"><div class="mon">${mhead(2026, 9, { next: false })}${grid(2026, 9, RANGE)}</div><div class="mon">${mhead(2026, 10, { prev: false })}${grid(2026, 10, RANGE)}</div></div>`;
const footSum = `<div class="foot">${sum}<span class="grow"></span><button class="btn g" data-tap>Cancel</button><button class="btn p" data-tap>Apply</button></div>`;
const wide = (inner) => `<div class="pop abs wide" data-target>${inner}</div>`;
const sheet = (inner) => `<div class="scrim" data-scrim></div><div class="sheet" data-target><div class="handle"></div>${inner}</div>`;

const rangeField = (extra = '') => `<div class="fld tgt rng">${lbl('Reporting period', true)}${ctl(`<span class="val"><span data-item="range-from">10 Nov 2026</span> → <span data-item="range-to">16 Nov 2026</span></span>${iconBtn}`, 'focus')}${rangeHint}${extra}</div>`;
const sub = (l, v, item, cls) => `<div class="fld"><div class="lbl sm">${l}</div>${ctl(`<span class="val" data-item="${item}">${v}</span>${iconBtn}`, cls)}</div>`;
const linked = (extra = '') => `<div class="fld tgt grp">${lbl('Reporting period', true)}<div class="row in">${sub('From', '10 Nov 2026', 'range-from', '')}${sub('To', '16 Nov 2026', 'range-to', 'focus')}</div>${rangeHint}${extra}</div>`;
const natSub = (l, v, item) => `<div class="fld"><div class="lbl sm">${l}</div><input class="ctl nat" type="date" value="${v}" max="2026-11-16" data-item="${item}"></div>`;
const rangeLayout = (vp, body, outside = '') => `${vp === 'desktop' ? '<h1 class="ttl">New report</h1>' : ''}${body}${outside}`;

export const rangeBefore = (vp) => rangeLayout(vp, `<div class="fld tgt grp">${lbl('Reporting period', true)}<div class="row in" data-target>${natSub('From', '2026-11-10', 'range-from')}${natSub('To', '2026-11-16', 'range-to')}</div>${rangeHint}</div>`);
export const rangeAfter = {
  title: { mobile: 'Date range on a phone', desktop: 'Date range on a computer' },
  question: { mobile: 'Which range picker on a phone?', desktop: 'Which range picker on a computer?' },
  options: [
    { name: 'Presets first', why: { mobile: 'One field. A sheet with the range and Apply on top, preset chips, then one month.', desktop: 'One field. Presets in a rail beside two months; the range, Cancel and Apply in the footer.' },
      render: (vp) => (vp === 'mobile'
        ? rangeLayout(vp, rangeField(), sheet(`<div class="srow">${sum}<span class="grow"></span><button class="btn p" data-tap>Apply</button></div>${chipRow(false)}${mhead(2026, 10)}${grid(2026, 10, RANGE)}`))
        : rangeLayout(vp, rangeField(wide(`<div class="ra"><div class="rail">${preBtns}</div>${twoMonths}</div>${footSum}`)))) },
    { name: 'Months first', why: { mobile: 'One field. Presets in a menu; the months scroll down in one list, the next month peeks below.', desktop: 'One field. Preset chips above two months; the range, Cancel and Apply in the footer.' },
      render: (vp) => (vp === 'mobile'
        ? rangeLayout(vp, rangeField(), sheet(`<div class="srow"><button class="btn" data-tap>Last 7 days ${ICON.down}</button><span class="grow"></span><button class="btn p" data-tap>Apply</button></div><div class="mlab">${sum}</div><div class="mlab">November 2026</div>${grid(2026, 10, RANGE)}<div class="mlab peek">December 2026</div>`))
        : rangeLayout(vp, rangeField(wide(`${chipRow(true)}${twoMonths}${footSum}`)))) },
    { name: 'Linked From and To fields', why: { mobile: 'Two fields, as today. One sheet: From and To tabs show which end you set, chips, one month.', desktop: 'Two fields, as today, sharing one two-month calendar; presets and Apply in the footer.' },
      render: (vp) => (vp === 'mobile'
        ? rangeLayout(vp, linked(), sheet(`<div class="segrow"><button class="sg" data-tap><small>From</small><span data-item="range-from">10 Nov</span></button><button class="sg on" data-tap><small>To</small><span data-item="range-to">16 Nov</span></button><button class="btn p" data-tap>Apply</button></div>${chipRow(false)}${mhead(2026, 10)}${grid(2026, 10, RANGE)}`))
        : rangeLayout(vp, linked(wide(`${twoMonths}<div class="foot">${preBtns}<span class="grow"></span><button class="btn p" data-tap>Apply</button></div>`)))) },
  ],
};
