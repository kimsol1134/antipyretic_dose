import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = process.cwd();
const RAW = join(ROOT, 'analytics-export', 'raw');
const OUT = join(ROOT, 'analytics-export', 'dashboard.html');

async function readJson<T = unknown>(name: string): Promise<T> {
  const text = await readFile(join(RAW, `${name}.json`), 'utf8');
  return JSON.parse(text) as T;
}

interface DailyRow { date: string; totalUsers: number; sessions: number; screenPageViews: number; newUsers: number; engagedSessions: number }
interface MonthlyRow { yearMonth: string; totalUsers: number; sessions: number; screenPageViews: number; bounceRate: number; averageSessionDuration: number }
interface ChannelRow { sessionDefaultChannelGroup: string; sessions: number; totalUsers: number; bounceRate: number }
interface PageRow { pagePath: string; pageTitle: string; screenPageViews: number; totalUsers: number; averageSessionDuration: number; bounceRate: number }
interface DeviceRow { deviceCategory: string; sessions: number; totalUsers: number; averageSessionDuration: number; bounceRate: number }
interface EventRow { eventName: string; eventCount: number; totalUsers: number }
interface CountryRow { country: string; sessions: number; totalUsers: number }
interface HourRow { hour: string; sessions: number; screenPageViews: number }
interface DowRow { dayOfWeek: string; sessions: number; screenPageViews: number }
interface SourceRow { sessionSource: string; sessionMedium: string; sessions: number; totalUsers: number }
interface LifetimeRow { totalUsers: number; newUsers: number; sessions: number; engagedSessions: number; screenPageViews: number; averageSessionDuration: number; bounceRate: number; eventCount: number }

async function main() {
  const [lifetime] = await readJson<LifetimeRow[]>('lifetime-totals');
  const daily = await readJson<DailyRow[]>('daily-timeseries');
  const monthly = await readJson<MonthlyRow[]>('monthly-timeseries');
  const channels = await readJson<ChannelRow[]>('traffic-channels');
  const pages = await readJson<PageRow[]>('top-pages');
  const devices = await readJson<DeviceRow[]>('devices');
  const events = await readJson<EventRow[]>('events');
  const countries = await readJson<CountryRow[]>('countries');
  const hours = await readJson<HourRow[]>('hour-of-day');
  const dow = await readJson<DowRow[]>('day-of-week');
  const sources = await readJson<SourceRow[]>('traffic-source-medium');

  // Sort hours numerically (GA returns "0","1","10","11"... as strings)
  hours.sort((a, b) => Number(a.hour) - Number(b.hour));
  dow.sort((a, b) => Number(a.dayOfWeek) - Number(b.dayOfWeek));

  // Compute 7-day moving average for daily users
  const dailySorted = [...daily].sort((a, b) => a.date.localeCompare(b.date));
  const ma7 = dailySorted.map((_, i) => {
    const window = dailySorted.slice(Math.max(0, i - 6), i + 1);
    return window.reduce((s, r) => s + r.totalUsers, 0) / window.length;
  });

  const formatDate = (d: string) => `${d.slice(4, 6)}-${d.slice(6, 8)}`;
  const formatMonth = (ym: string) => `${ym.slice(0, 4)}-${ym.slice(4, 6)}`;

  // Conversion funnel numbers
  const totalUsers = lifetime.totalUsers;
  const formStartUsers = events.find((e) => e.eventName === 'form_start')?.totalUsers ?? 0;
  const calcUsers = events.find((e) => e.eventName === 'dosage_calculation')?.totalUsers ?? 0;
  const blogUsers = events.find((e) => e.eventName === 'blog_read')?.totalUsers ?? 0;

  const topPages = pages.slice(0, 10);
  const topCountries = countries.slice(0, 8);
  const topSources = sources.slice(0, 8);

  const data = {
    lifetime,
    daily: dailySorted,
    ma7,
    monthly,
    channels,
    pages: topPages,
    devices,
    events,
    countries: topCountries,
    hours,
    dow,
    sources: topSources,
    funnel: {
      totalUsers,
      formStartUsers,
      calcUsers,
      blogUsers,
    },
  };

  const html = render(data);
  await writeFile(OUT, html, 'utf8');
  console.log(`Dashboard written: ${OUT}`);
}

function render(d: ReturnType<typeof Object>): string {
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>kidsfever.xyz — GA4 Analytics Dashboard</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<style>
  :root {
    --bg: #0b1020;
    --surface: #131a34;
    --surface-2: #1b2447;
    --border: #2a3560;
    --text: #e6ecff;
    --text-dim: #9aa7cf;
    --accent: #6366f1;
    --accent-2: #22d3ee;
    --success: #34d399;
    --warning: #fbbf24;
    --danger: #f87171;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Pretendard', Roboto, sans-serif;
    background: var(--bg); color: var(--text); line-height: 1.5;
  }
  header {
    padding: 32px 40px 24px; border-bottom: 1px solid var(--border);
    background: linear-gradient(180deg, #141c3f 0%, #0b1020 100%);
  }
  header .title { font-size: 22px; font-weight: 700; letter-spacing: -0.3px; }
  header .subtitle { font-size: 13px; color: var(--text-dim); margin-top: 4px; }
  header .badge { display:inline-block; margin-left:8px; padding:2px 8px; background:var(--accent); border-radius:999px; font-size:11px; font-weight:600; }
  main { padding: 24px 40px 60px; max-width: 1480px; margin: 0 auto; }

  .kpis { display: grid; grid-template-columns: repeat(6, 1fr); gap: 14px; margin-bottom: 28px; }
  .kpi { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px 18px; }
  .kpi .label { font-size: 11px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.6px; }
  .kpi .value { font-size: 26px; font-weight: 700; margin-top: 4px; letter-spacing: -0.4px; }
  .kpi .delta { font-size: 12px; margin-top: 4px; color: var(--text-dim); }
  .kpi.good .value { color: var(--success); }
  .kpi.warn .value { color: var(--warning); }

  h2 { font-size: 14px; text-transform: uppercase; color: var(--text-dim); letter-spacing: 1px; margin: 28px 0 12px; font-weight: 600; }
  .grid { display: grid; gap: 14px; }
  .grid.cols-2 { grid-template-columns: 2fr 1fr; }
  .grid.cols-2b { grid-template-columns: 1fr 1fr; }
  .grid.cols-3 { grid-template-columns: repeat(3, 1fr); }

  .card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
    padding: 18px 20px;
  }
  .card h3 { margin: 0 0 4px; font-size: 14px; font-weight: 600; }
  .card .note { color: var(--text-dim); font-size: 12px; margin-bottom: 14px; }
  .card .chart-wrap { position: relative; height: 280px; }
  .card.tall .chart-wrap { height: 360px; }
  .card.short .chart-wrap { height: 220px; }

  .funnel { display: flex; flex-direction: column; gap: 10px; }
  .funnel-row { display: flex; align-items: center; gap: 12px; }
  .funnel-row .label { width: 180px; font-size: 13px; color: var(--text-dim); }
  .funnel-row .bar { flex: 1; background: var(--surface-2); border-radius: 6px; height: 32px; position: relative; overflow: hidden; }
  .funnel-row .fill { height: 100%; background: linear-gradient(90deg, var(--accent) 0%, var(--accent-2) 100%); display: flex; align-items: center; padding-left: 12px; font-size: 13px; font-weight: 600; }
  .funnel-row .pct { width: 70px; text-align: right; font-size: 13px; color: var(--text-dim); }

  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  table th, table td { padding: 8px 10px; text-align: left; border-bottom: 1px solid var(--border); }
  table th { color: var(--text-dim); font-weight: 500; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
  table td.num { text-align: right; font-variant-numeric: tabular-nums; }
  table .path { font-family: ui-monospace, SFMono-Regular, monospace; font-size: 12px; color: #c7d2fe; }

  .chip { display:inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }
  .chip.good { background: rgba(52, 211, 153, 0.15); color: #6ee7b7; }
  .chip.warn { background: rgba(251, 191, 36, 0.15); color: #fcd34d; }
  .chip.bad { background: rgba(248, 113, 113, 0.15); color: #fca5a5; }

  @media (max-width: 1200px) {
    .kpis { grid-template-columns: repeat(3, 1fr); }
    .grid.cols-2, .grid.cols-2b, .grid.cols-3 { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>
<header>
  <div class="title">kidsfever.xyz — GA4 Analytics Dashboard <span class="badge">6개월 누적</span></div>
  <div class="subtitle">2025-10-27 → 2026-04-22 · Property 513601098 · Generated ${new Date().toISOString().slice(0, 10)}</div>
</header>

<main>
  <!-- KPIs -->
  <div class="kpis">
    <div class="kpi"><div class="label">Total Users</div><div class="value">${fmt(d.lifetime.totalUsers)}</div><div class="delta">신규 ${fmt(d.lifetime.newUsers)}명 (${pct(d.lifetime.newUsers, d.lifetime.totalUsers)})</div></div>
    <div class="kpi"><div class="label">Sessions</div><div class="value">${fmt(d.lifetime.sessions)}</div><div class="delta">참여 ${pct(d.lifetime.engagedSessions, d.lifetime.sessions)}</div></div>
    <div class="kpi"><div class="label">Pageviews</div><div class="value">${fmt(d.lifetime.screenPageViews)}</div><div class="delta">세션당 ${(d.lifetime.screenPageViews / d.lifetime.sessions).toFixed(2)}</div></div>
    <div class="kpi good"><div class="label">Conversion (계산 실행)</div><div class="value">${pct(d.funnel.calcUsers, d.funnel.totalUsers)}</div><div class="delta">${fmt(d.funnel.calcUsers)}명이 계산 완료</div></div>
    <div class="kpi good"><div class="label">Bounce Rate</div><div class="value">${(d.lifetime.bounceRate * 100).toFixed(1)}%</div><div class="delta">업계 평균(~50%) 대비 매우 낮음</div></div>
    <div class="kpi"><div class="label">Avg Session</div><div class="value">${secToMinSec(d.lifetime.averageSessionDuration)}</div><div class="delta">사용자당 이벤트 ${(d.lifetime.eventCount / d.lifetime.totalUsers).toFixed(1)}</div></div>
  </div>

  <!-- 1. Growth -->
  <h2>1. Growth Trajectory · 성장 추이</h2>
  <div class="grid cols-2">
    <div class="card tall"><h3>Daily Users (7일 이동평균 오버레이)</h3><div class="note">2026-01 중순 이후 겨울 시즌 피크 형성 → 3월부터 자연 감소</div><div class="chart-wrap"><canvas id="dailyChart"></canvas></div></div>
    <div class="card tall"><h3>Monthly Users</h3><div class="note">1월 MoM +189% 🚀</div><div class="chart-wrap"><canvas id="monthlyChart"></canvas></div></div>
  </div>

  <!-- 2. Acquisition -->
  <h2>2. Acquisition · 유입 경로</h2>
  <div class="grid cols-2">
    <div class="card"><h3>Traffic Channels</h3><div class="note">Organic Search가 74.5%를 차지 — 그중 대부분이 네이버</div><div class="chart-wrap"><canvas id="channelChart"></canvas></div></div>
    <div class="card"><h3>Top Sources</h3><div class="note">모바일 네이버 검색 단일 경로가 65%</div>
      <table>
        <thead><tr><th>Source</th><th>Medium</th><th class="num">Sessions</th></tr></thead>
        <tbody>${d.sources.map((s: SourceRow) => `<tr><td>${escapeHtml(s.sessionSource)}</td><td style="color:var(--text-dim)">${escapeHtml(s.sessionMedium)}</td><td class="num">${fmt(s.sessions)}</td></tr>`).join('')}</tbody>
      </table>
    </div>
  </div>

  <!-- 3. Funnel -->
  <h2>3. Conversion Funnel · 전환 퍼널</h2>
  <div class="card">
    <h3>방문 → 폼 시작 → 계산 완료</h3>
    <div class="note">폼 시작 대비 완료율 98.6% — 폼 UX 매우 양호. 전체 방문자 대비 계산 전환율 45.9%.</div>
    <div class="funnel" style="margin-top: 16px;">
      ${funnelRow('All Users', d.funnel.totalUsers, d.funnel.totalUsers)}
      ${funnelRow('Form Start', d.funnel.formStartUsers, d.funnel.totalUsers)}
      ${funnelRow('Dosage Calculation', d.funnel.calcUsers, d.funnel.totalUsers)}
      ${funnelRow('Blog Read', d.funnel.blogUsers, d.funnel.totalUsers)}
    </div>
  </div>

  <!-- 4. Content -->
  <h2>4. Content Performance · 페이지별</h2>
  <div class="grid cols-2">
    <div class="card tall"><h3>Top 10 Pages (Pageviews)</h3><div class="chart-wrap"><canvas id="pagesChart"></canvas></div></div>
    <div class="card tall"><h3>블로그 체류시간 (초)</h3><div class="note">tylenol-dosage-by-weight가 가장 오래 읽힘 (2:55)</div><div class="chart-wrap"><canvas id="blogEngagementChart"></canvas></div></div>
  </div>

  <!-- 5. Timing -->
  <h2>5. Timing Patterns · 시간 패턴</h2>
  <div class="grid cols-2b">
    <div class="card"><h3>시간대별 세션 (Hour of Day, KST)</h3><div class="note">저녁 20-22시 피크 = 아이 발열 시간대</div><div class="chart-wrap"><canvas id="hourChart"></canvas></div></div>
    <div class="card"><h3>요일별 세션</h3><div class="note">월/화 피크, 토요일 최저</div><div class="chart-wrap"><canvas id="dowChart"></canvas></div></div>
  </div>

  <!-- 6. Device & Geo -->
  <h2>6. Device & Geography · 기기와 지역</h2>
  <div class="grid cols-3">
    <div class="card"><h3>디바이스 분포</h3><div class="chart-wrap"><canvas id="deviceChart"></canvas></div></div>
    <div class="card"><h3>Device별 이탈률 격차</h3><div class="note">데스크톱 이탈률이 모바일의 2배 — UX 점검 필요</div><div class="chart-wrap"><canvas id="deviceBounceChart"></canvas></div></div>
    <div class="card"><h3>국가별 (상위 8)</h3><div class="note">한국 92.4%, 해외 SEO 임팩트 아직 제한적</div><div class="chart-wrap"><canvas id="countryChart"></canvas></div></div>
  </div>

  <!-- 7. Event distribution -->
  <h2>7. Event Distribution · 사용자 행동</h2>
  <div class="card"><h3>이벤트별 사용자 수</h3><div class="note">drug_info_view / similar_products_expanded / faq_interaction은 발견률이 매우 낮음 — 배치 개선 여지</div><div class="chart-wrap" style="height:340px"><canvas id="eventsChart"></canvas></div></div>
</main>

<script>
const C = {
  accent: '#6366f1', accent2: '#22d3ee', grid: 'rgba(255,255,255,0.06)',
  text: '#9aa7cf', success: '#34d399', warning: '#fbbf24', danger: '#f87171',
  palette: ['#6366f1','#22d3ee','#f472b6','#34d399','#fbbf24','#f87171','#a78bfa','#fb923c'],
};
Chart.defaults.color = C.text;
Chart.defaults.borderColor = C.grid;
Chart.defaults.font.family = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Pretendard, Roboto, sans-serif";

const daily = ${JSON.stringify(d.daily)};
const ma7 = ${JSON.stringify(d.ma7)};
const monthly = ${JSON.stringify(d.monthly)};
const channels = ${JSON.stringify(d.channels)};
const pages = ${JSON.stringify(d.pages)};
const devices = ${JSON.stringify(d.devices)};
const events = ${JSON.stringify(d.events)};
const countries = ${JSON.stringify(d.countries)};
const hours = ${JSON.stringify(d.hours)};
const dow = ${JSON.stringify(d.dow)};

const fmtDate = (s) => s.slice(4,6) + '-' + s.slice(6,8);
const fmtMonth = (s) => s.slice(0,4) + '-' + s.slice(4,6);

new Chart(document.getElementById('dailyChart'), {
  type: 'line',
  data: {
    labels: daily.map(r => fmtDate(r.date)),
    datasets: [
      { label: 'Daily Users', data: daily.map(r => r.totalUsers), borderColor: C.accent, backgroundColor: 'rgba(99,102,241,0.15)', fill: true, tension: 0.3, pointRadius: 0, borderWidth: 1.5 },
      { label: '7-day MA', data: ma7, borderColor: C.accent2, borderWidth: 2, pointRadius: 0, fill: false, tension: 0.4 },
    ],
  },
  options: { responsive: true, maintainAspectRatio: false, interaction: { intersect: false, mode: 'index' }, scales: { x: { ticks: { maxTicksLimit: 12 } } } },
});

new Chart(document.getElementById('monthlyChart'), {
  type: 'bar',
  data: {
    labels: monthly.map(r => fmtMonth(r.yearMonth)),
    datasets: [{ label: 'Users', data: monthly.map(r => r.totalUsers), backgroundColor: monthly.map((_, i) => i === 2 ? C.success : C.accent), borderRadius: 6 }],
  },
  options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
});

new Chart(document.getElementById('channelChart'), {
  type: 'doughnut',
  data: {
    labels: channels.map(c => c.sessionDefaultChannelGroup),
    datasets: [{ data: channels.map(c => c.sessions), backgroundColor: C.palette, borderColor: '#131a34', borderWidth: 2 }],
  },
  options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } }, cutout: '55%' },
});

const pagesSorted = [...pages].sort((a,b) => a.screenPageViews - b.screenPageViews);
new Chart(document.getElementById('pagesChart'), {
  type: 'bar',
  data: {
    labels: pagesSorted.map(p => p.pagePath),
    datasets: [{ label: 'Pageviews', data: pagesSorted.map(p => p.screenPageViews), backgroundColor: C.accent, borderRadius: 4 }],
  },
  options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
});

const blogPages = pages.filter(p => p.pagePath.startsWith('/blog/')).slice(0, 6);
new Chart(document.getElementById('blogEngagementChart'), {
  type: 'bar',
  data: {
    labels: blogPages.map(p => p.pagePath.replace('/blog/','')),
    datasets: [{ label: '평균 체류(초)', data: blogPages.map(p => Math.round(p.averageSessionDuration)), backgroundColor: C.accent2, borderRadius: 4 }],
  },
  options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
});

new Chart(document.getElementById('hourChart'), {
  type: 'bar',
  data: {
    labels: hours.map(h => h.hour + '시'),
    datasets: [{ label: 'Sessions', data: hours.map(h => h.sessions), backgroundColor: hours.map(h => { const n = Number(h.hour); return n >= 20 && n <= 22 ? C.warning : C.accent; }), borderRadius: 3 }],
  },
  options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
});

const dowLabels = ['일','월','화','수','목','금','토'];
new Chart(document.getElementById('dowChart'), {
  type: 'bar',
  data: {
    labels: dow.map(r => dowLabels[Number(r.dayOfWeek)]),
    datasets: [{ label: 'Sessions', data: dow.map(r => r.sessions), backgroundColor: C.accent2, borderRadius: 3 }],
  },
  options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
});

new Chart(document.getElementById('deviceChart'), {
  type: 'doughnut',
  data: {
    labels: devices.map(d => d.deviceCategory),
    datasets: [{ data: devices.map(d => d.sessions), backgroundColor: [C.accent, C.warning, C.accent2], borderColor: '#131a34', borderWidth: 2 }],
  },
  options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, cutout: '55%' },
});

new Chart(document.getElementById('deviceBounceChart'), {
  type: 'bar',
  data: {
    labels: devices.map(d => d.deviceCategory),
    datasets: [{ label: 'Bounce Rate %', data: devices.map(d => +(d.bounceRate * 100).toFixed(1)), backgroundColor: devices.map(d => d.bounceRate > 0.4 ? C.danger : C.success), borderRadius: 4 }],
  },
  options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: v => v + '%' } } } },
});

new Chart(document.getElementById('countryChart'), {
  type: 'bar',
  data: {
    labels: countries.map(c => c.country),
    datasets: [{ label: 'Sessions', data: countries.map(c => c.sessions), backgroundColor: C.accent, borderRadius: 3 }],
  },
  options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { type: 'logarithmic' } } },
});

const eventsSorted = [...events].sort((a,b) => a.totalUsers - b.totalUsers);
new Chart(document.getElementById('eventsChart'), {
  type: 'bar',
  data: {
    labels: eventsSorted.map(e => e.eventName),
    datasets: [{ label: 'Users', data: eventsSorted.map(e => e.totalUsers), backgroundColor: C.accent, borderRadius: 3 }],
  },
  options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { type: 'logarithmic' } } },
});
</script>
</body>
</html>`;
}

function fmt(n: number): string {
  return n.toLocaleString('en-US');
}
function pct(a: number, b: number): string {
  return ((a / b) * 100).toFixed(1) + '%';
}
function secToMinSec(s: number): string {
  const m = Math.floor(s / 60);
  const r = Math.round(s - m * 60);
  return `${m}:${String(r).padStart(2, '0')}`;
}
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function funnelRow(label: string, count: number, base: number): string {
  const p = (count / base) * 100;
  return `<div class="funnel-row"><div class="label">${label}</div><div class="bar"><div class="fill" style="width:${Math.max(p, 4)}%">${fmt(count)}명</div></div><div class="pct">${p.toFixed(1)}%</div></div>`;
}

interface SourceRow { sessionSource: string; sessionMedium: string; sessions: number; totalUsers: number }

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
