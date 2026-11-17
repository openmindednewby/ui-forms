const C = { bg: '#FFFFFF', text: '#0D2340', text2: '#4A5A72', border: '#7F8DA3', divider: '#D7DDE6', primary: '#123159', on: '#FFFFFF', error: '#B42318' };
const DECEL = 'cubic-bezier(0,0,0,1)';
const STANDARD = 'cubic-bezier(0.2,0,0,1)';
const OPEN = {
  grow: ['from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}', `180ms ${DECEL}`],
  fade: ['from{opacity:0}to{opacity:1}', '140ms linear'],
  drop: ['from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}', `160ms ${DECEL}`],
};
const MONTH = {
  nudge: ['from{opacity:1;transform:none}to{opacity:0;transform:translateX(-16px)}', 'from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:none}', `200ms ${STANDARD}`],
  fade: ['from{opacity:1}to{opacity:0}', 'from{opacity:0}to{opacity:1}', '140ms linear'],
  full: ['from{opacity:1;transform:none}to{opacity:1;transform:translateX(-328px)}', 'from{transform:translateX(328px)}to{transform:none}', `200ms ${STANDARD}`],
};
const COL = 44.57;

function days(y, m, sel) {
  const lead = (new Date(Date.UTC(y, m, 1)).getUTCDay() + 6) % 7;
  const n = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  let out = '';
  for (let d = 1; d <= n; d += 1) {
    const i = lead + d - 1;
    const x = (24 + (i % 7 + 0.5) * COL).toFixed(1);
    const y0 = 264 + Math.floor(i / 7) * 44;
    if (d === sel) out += `<circle cx="${x}" cy="${y0 - 5}" r="19" fill="${C.primary}"/>`;
    out += `<text x="${x}" y="${y0}" text-anchor="middle" font-size="15" ${d === sel ? `fill="${C.on}" font-weight="700"` : `fill="${C.text}"`}>${d}</text>`;
  }
  return out;
}

const MONTH_NAMES = { 10: 'November 2026', 11: 'December 2026' };
const monthGroup = (cls, m, sel) => `<g class="${cls}"><text x="180" y="201" text-anchor="middle" font-size="15" font-weight="700" fill="${C.text}">${MONTH_NAMES[m]}</text>${days(2026, m, sel)}</g>`;
const chevron = (x, d) => `<path d="${d}" transform="translate(${x} 186)" fill="none" stroke="${C.text}" stroke-width="1.8"/>`;
const weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((w, i) => `<text x="${(24 + (i + 0.5) * COL).toFixed(1)}" y="232" text-anchor="middle" font-size="12" fill="${C.text2}">${w}</text>`).join('');

export function motionSvg(m) {
  const [openKf, openT] = OPEN[m.open];
  const [outKf, inKf, monthT] = MONTH[m.month];
  const css = `text{font-family:"Segoe UI",system-ui,sans-serif}
.ring{opacity:0;animation:ring 100ms linear 200ms both}@keyframes ring{from{opacity:0}to{opacity:1}}
.pop{transform-box:fill-box;transform-origin:50% 0;animation:open ${openT} 300ms both}@keyframes open{${openKf}}
.press{opacity:0;animation:press 300ms linear 1000ms both}@keyframes press{0%{opacity:0}40%{opacity:.18}100%{opacity:0}}
.m1{opacity:0;animation:mout ${monthT} 1200ms both}@keyframes mout{${outKf}}
.m2{animation:min ${monthT} 1200ms both}@keyframes min{${inKf}}
@media (prefers-reduced-motion: reduce){*{animation:none!important}}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="640" viewBox="0 0 360 640"><style>${css}</style>
<rect width="360" height="640" fill="${C.bg}"/><path d="M0 44.5h360" stroke="${C.divider}"/><text x="40" y="27" font-size="15" font-weight="600" fill="${C.text}">New deal</text>
<text x="16" y="76" font-size="13" font-weight="600" fill="${C.text}"><tspan data-item="label">Expected close</tspan><tspan data-item="required" fill="${C.error}"> *</tspan></text>
<rect x="16.5" y="84.5" width="327" height="47" rx="9" fill="${C.bg}" stroke="${C.border}"/><rect class="ring" x="13" y="81" width="334" height="54" rx="11" fill="none" stroke="${C.primary}" stroke-width="2"/>
<text x="28" y="113" font-size="15" fill="${C.text}">20 Nov 2026</text>
<g transform="translate(310 98)" fill="none" stroke="${C.text}" stroke-width="1.6"><rect x="0" y="1" width="14" height="12.5" rx="2"/><path d="M0 5h14M4 -1v4M10 -1v4"/></g>
<text x="16" y="152" font-size="13" fill="${C.text2}"><tspan data-item="hint">When you expect to sign.</tspan><tspan data-item="enter"> Enter saves.</tspan></text>
<defs><clipPath id="clip"><rect x="16" y="164" width="328" height="348" rx="12"/></clipPath></defs>
<g class="pop"><rect x="16.5" y="164.5" width="327" height="347" rx="12" fill="${C.bg}" stroke="${C.divider}"/>
${chevron(36, 'M12.5 4.5 7 10l5.5 5.5')}${chevron(304, 'M7.5 4.5 13 10l-5.5 5.5')}<circle class="press" cx="314" cy="196" r="20" fill="${C.primary}"/>${weekdays}
<g clip-path="url(#clip)">${monthGroup('m1', 10, 20)}${monthGroup('m2', 11, 0)}</g></g>
<text x="180" y="600" text-anchor="middle" font-size="12" fill="${C.text2}">${m.cap}</text></svg>`;
}

export const MOTION = [
  { name: 'Grow from the field', open: 'grow', month: 'nudge', cap: 'Open 180 ms scale + fade · month 200 ms, 16 px slide', why: 'Opens with a small scale and fade in 180 ms; months slide 16 px in 200 ms. Shows where the calendar came from.' },
  { name: 'Fade only', open: 'fade', month: 'fade', cap: 'Open 140 ms fade · month 140 ms cross-fade', why: 'Opens and changes month with a 140 ms fade, no movement. The calmest; suits dense forms.' },
  { name: 'Drop and slide', open: 'drop', month: 'full', cap: 'Open 160 ms, 8 px drop + fade · month 200 ms full-width slide', why: 'Drops 8 px with a fade in 160 ms; the month slides a full width in 200 ms, the way the arrow points.' },
];
