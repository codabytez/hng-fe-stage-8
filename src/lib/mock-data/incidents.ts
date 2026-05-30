import { createSeededRandom } from "./seeded-random";

const TITLES = [
  "Database connection timeout","Memory leak in auth service","API rate limit exceeded",
  "SSL certificate expiry","Cache invalidation failure","Network partition detected",
  "Unauthorized access attempt","Service degradation","Config drift detected",
  "Disk I/O saturation","CPU spike in worker pool","Queue backpressure",
  "DNS resolution failure","Load balancer health check failure","Replica lag alert",
  "Key rotation required","Audit log gaps detected","Deploy rollback triggered",
  "Circuit breaker opened","Data pipeline stall","Webhook delivery failure",
  "Token refresh loop","CORS policy violation","Shard rebalancing timeout",
  "Snapshot corruption","Metrics ingestion lag","Alert storm","Probe timeout",
  "Cluster upgrade blocked","Storage threshold breach","Auth token leak",
  "Schema migration failure","Pod eviction cascade","Namespace quota exceeded",
  "Canary analysis failure","Feature flag storm","GraphQL depth limit hit",
  "Event sourcing gap","Cron job drift","Batch job OOM killed",
];

const SEVERITIES = ["critical","high","medium","low","info"] as const;
const STATUSES = ["open","investigating","resolved","closed","wontfix"] as const;
const SYSTEMS = ["auth-service","api-gateway","worker-pool","database","cache","cdn","queue","scheduler","monitor","notifier","storage","search"];
const REPORTERS = ["SRE Bot","Prometheus","PagerDuty","Datadog","Sentry","Grafana","Zabbix","Manual","Nagios","CloudWatch"];

export interface Incident {
  id: string;
  title: string;
  severity: string;
  reportedAt: string;
  resolvedAt: string | null;
  affectedSystems: string[];
  reporter: string;
  status: string;
  responseTime: number;
  isEscalated: boolean;
}

function isoDate(rng: () => number, startYear = 2022, endYear = 2024): string {
  const year = startYear + Math.floor(rng() * (endYear - startYear + 1));
  const month = String(Math.floor(rng() * 12) + 1).padStart(2, "0");
  const day = String(Math.floor(rng() * 28) + 1).padStart(2, "0");
  const hour = String(Math.floor(rng() * 24)).padStart(2, "0");
  const min = String(Math.floor(rng() * 60)).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${min}:00.000Z`;
}

export function generateIncidents(count = 203): Incident[] {
  const rng = createSeededRandom(7);
  return Array.from({ length: count }, (_, i) => {
    const sysCount = 1 + Math.floor(rng() * 4);
    const affected: string[] = [];
    for (let j = 0; j < sysCount; j++) {
      const s = SYSTEMS[Math.floor(rng() * SYSTEMS.length)];
      if (!affected.includes(s)) affected.push(s);
    }
    const status = STATUSES[Math.floor(rng() * STATUSES.length)];
    const resolved = ["resolved","closed"].includes(status) ? isoDate(rng, 2022, 2024) : null;
    return {
      id: `incident-${i + 1}`,
      title: TITLES[i % TITLES.length],
      severity: SEVERITIES[Math.floor(rng() * SEVERITIES.length)],
      reportedAt: isoDate(rng),
      resolvedAt: resolved,
      affectedSystems: affected,
      reporter: REPORTERS[Math.floor(rng() * REPORTERS.length)],
      status,
      responseTime: Math.floor(rng() * 480),
      isEscalated: rng() > 0.75,
    };
  });
}

export const incidents = generateIncidents();
