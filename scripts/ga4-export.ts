import { BetaAnalyticsDataClient, protos } from '@google-analytics/data';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

type RunReportRequest = protos.google.analytics.data.v1beta.IRunReportRequest;
type ReportRow = protos.google.analytics.data.v1beta.IRow;

const PROPERTY_ID = process.env.GA4_PROPERTY_ID ?? '513601098';
const KEY_FILE =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ??
  '/Users/solkim/Downloads/antipyretic-analytics-4b654924f681.json';
const START_DATE = process.env.GA4_START_DATE ?? '2025-10-27';
const END_DATE = process.env.GA4_END_DATE ?? 'today';
const OUT_DIR = join(process.cwd(), 'analytics-export');
const RAW_DIR = join(OUT_DIR, 'raw');

const client = new BetaAnalyticsDataClient({ keyFilename: KEY_FILE });

interface ReportDef {
  name: string;
  dimensions: string[];
  metrics: string[];
  orderBys?: RunReportRequest['orderBys'];
  limit?: number;
}

const REPORTS: ReportDef[] = [
  {
    name: 'lifetime-totals',
    dimensions: [],
    metrics: [
      'totalUsers',
      'newUsers',
      'sessions',
      'engagedSessions',
      'screenPageViews',
      'userEngagementDuration',
      'averageSessionDuration',
      'bounceRate',
      'eventCount',
    ],
  },
  {
    name: 'daily-timeseries',
    dimensions: ['date'],
    metrics: [
      'totalUsers',
      'newUsers',
      'sessions',
      'screenPageViews',
      'engagedSessions',
      'userEngagementDuration',
    ],
    orderBys: [{ dimension: { dimensionName: 'date' } }],
  },
  {
    name: 'monthly-timeseries',
    dimensions: ['yearMonth'],
    metrics: [
      'totalUsers',
      'newUsers',
      'sessions',
      'screenPageViews',
      'averageSessionDuration',
      'bounceRate',
    ],
    orderBys: [{ dimension: { dimensionName: 'yearMonth' } }],
  },
  {
    name: 'top-pages',
    dimensions: ['pagePath', 'pageTitle'],
    metrics: ['screenPageViews', 'totalUsers', 'averageSessionDuration', 'bounceRate'],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 100,
  },
  {
    name: 'landing-pages',
    dimensions: ['landingPage'],
    metrics: ['sessions', 'totalUsers', 'bounceRate', 'averageSessionDuration'],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 50,
  },
  {
    name: 'traffic-channels',
    dimensions: ['sessionDefaultChannelGroup'],
    metrics: ['sessions', 'totalUsers', 'engagedSessions', 'bounceRate'],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
  },
  {
    name: 'traffic-source-medium',
    dimensions: ['sessionSource', 'sessionMedium'],
    metrics: ['sessions', 'totalUsers', 'engagedSessions'],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 50,
  },
  {
    name: 'referrers',
    dimensions: ['pageReferrer'],
    metrics: ['sessions', 'totalUsers'],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 50,
  },
  {
    name: 'devices',
    dimensions: ['deviceCategory'],
    metrics: ['sessions', 'totalUsers', 'averageSessionDuration', 'bounceRate'],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
  },
  {
    name: 'browsers',
    dimensions: ['browser'],
    metrics: ['sessions', 'totalUsers'],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 20,
  },
  {
    name: 'operating-systems',
    dimensions: ['operatingSystem'],
    metrics: ['sessions', 'totalUsers'],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 20,
  },
  {
    name: 'countries',
    dimensions: ['country'],
    metrics: ['sessions', 'totalUsers'],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 30,
  },
  {
    name: 'cities',
    dimensions: ['city', 'country'],
    metrics: ['sessions', 'totalUsers'],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 50,
  },
  {
    name: 'languages',
    dimensions: ['language'],
    metrics: ['sessions', 'totalUsers'],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 20,
  },
  {
    name: 'events',
    dimensions: ['eventName'],
    metrics: ['eventCount', 'totalUsers'],
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    limit: 50,
  },
  {
    name: 'hour-of-day',
    dimensions: ['hour'],
    metrics: ['sessions', 'screenPageViews'],
    orderBys: [{ dimension: { dimensionName: 'hour' } }],
  },
  {
    name: 'day-of-week',
    dimensions: ['dayOfWeek'],
    metrics: ['sessions', 'screenPageViews'],
    orderBys: [{ dimension: { dimensionName: 'dayOfWeek' } }],
  },
];

interface FlatRow {
  [key: string]: string | number;
}

function flattenRows(report: {
  dimensions: string[];
  metrics: string[];
  rows: ReportRow[];
}): FlatRow[] {
  return report.rows.map((row) => {
    const out: FlatRow = {};
    row.dimensionValues?.forEach((v, i) => {
      out[report.dimensions[i]] = v.value ?? '';
    });
    row.metricValues?.forEach((v, i) => {
      const raw = v.value ?? '0';
      const num = Number(raw);
      out[report.metrics[i]] = Number.isFinite(num) ? num : raw;
    });
    return out;
  });
}

function toCsv(rows: FlatRow[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const escape = (val: unknown) => {
    const s = String(val ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(','));
  }
  return lines.join('\n');
}

async function runReport(def: ReportDef) {
  const [response] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate: START_DATE, endDate: END_DATE }],
    dimensions: def.dimensions.map((name) => ({ name })),
    metrics: def.metrics.map((name) => ({ name })),
    orderBys: def.orderBys,
    limit: def.limit ?? 100000,
  });

  const flat = flattenRows({
    dimensions: def.dimensions,
    metrics: def.metrics,
    rows: response.rows ?? [],
  });

  await writeFile(
    join(RAW_DIR, `${def.name}.json`),
    JSON.stringify(flat, null, 2),
    'utf8',
  );
  await writeFile(join(RAW_DIR, `${def.name}.csv`), toCsv(flat), 'utf8');

  return { name: def.name, rows: flat.length };
}

async function main() {
  await mkdir(RAW_DIR, { recursive: true });

  console.log(`Property: ${PROPERTY_ID}`);
  console.log(`Range:    ${START_DATE} → ${END_DATE}`);
  console.log(`Output:   ${OUT_DIR}`);
  console.log('');

  for (const def of REPORTS) {
    try {
      const result = await runReport(def);
      console.log(`  ✓ ${result.name.padEnd(24)} ${result.rows} rows`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ ${def.name.padEnd(24)} ${msg}`);
    }
  }

  const meta = {
    propertyId: PROPERTY_ID,
    startDate: START_DATE,
    endDate: END_DATE,
    generatedAt: new Date().toISOString(),
    reports: REPORTS.map((r) => r.name),
  };
  await writeFile(
    join(OUT_DIR, 'meta.json'),
    JSON.stringify(meta, null, 2),
    'utf8',
  );

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
