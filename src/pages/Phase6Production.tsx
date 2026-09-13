import { CheckCircle2, Server, Shield, GitBranch, Activity, Cloud, Lock, Database, Eye, AlertTriangle, Rocket, FileText } from 'lucide-react';
import { Card, Badge, Alert } from '../components/ui';

// ==================== Pre-Flight Validation ====================
function PreFlightValidation() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          Pre-Flight Validation — Phase 5 Sign-Off
        </h2>
        <p className="text-gray-400">تأیید نهایی آمادگی MVP برای production</p>
      </div>

      <Alert variant="success" title="✅ MVP آماده Production است">
        تمام معیارهای فاز ۵ برآورده شده و سیستم آماده Go-Live است.
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: 'Security Audit', status: 'pass', detail: 'Zero Critical/High vulns, RBAC impenetrable' },
          { title: 'Performance Audit', status: 'pass', detail: 'API p95 < 300ms, CWV met' },
          { title: 'E2E Flows', status: 'pass', detail: 'Order to Provisioning 100% pass' },
          { title: 'Database', status: 'pass', detail: 'Migrations finalized, pooling optimized' },
        ].map((item) => (
          <Card key={item.title}>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <div>
                <h3 className="text-white font-bold">{item.title}</h3>
                <p className="text-xs text-gray-400">{item.detail}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

// ==================== Production Infrastructure ====================
function ProductionInfrastructure() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Server className="w-7 h-7 text-blue-400" />
          Production Infrastructure & IaC
        </h2>
        <p className="text-gray-400">زیرساخت production با Terraform و Ansible</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="layer-owned">
          <h3 className="text-lg font-bold text-emerald-400 mb-3">🇮🇷 Iranian Primary DC</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Kubernetes Cluster (RKE2)</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> PostgreSQL HA (3 nodes)</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> NATS JetStream HA (3 nodes)</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Redis Sentinel</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> MinIO (Object Storage)</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> ClickHouse (BI)</li>
          </ul>
        </Card>

        <Card className="layer-european">
          <h3 className="text-lg font-bold text-indigo-400 mb-3">🇪🇺 European Secondary DC</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2"><span className="text-indigo-400">•</span> Backup Infrastructure</li>
            <li className="flex items-start gap-2"><span className="text-indigo-400">•</span> Disaster Recovery</li>
            <li className="flex items-start gap-2"><span className="text-indigo-400">•</span> International Services</li>
            <li className="flex items-start gap-2"><span className="text-indigo-400">•</span> Cross-Border Data Storage</li>
            <li className="flex items-start gap-2"><span className="text-indigo-400">•</span> Backup Replication</li>
          </ul>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🔧 Terraform Configuration</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`# infrastructure/terraform/main.tf
module "iran_primary_dc" {
  source = "./modules/iran-dc"
  
  k8s_cluster = {
    name     = "abran-prod-iran"
    nodes    = 5
    instance_type = "m5.xlarge"
  }
  
  postgres = {
    engine_version = "16"
    instance_class = "db.r5.xlarge"
    multi_az       = true
    backup_retention = 30
  }
  
  nats = {
    cluster_size = 3
    jetstream    = true
  }
  
  redis = {
    node_type = "cache.r5.large"
    num_cache_clusters = 3
  }
}

module "europe_secondary_dc" {
  source = "./modules/europe-dc"
  
  purpose = "backup_dr"
  
  postgres_replica = {
    source_region = "iran"
    replica_type  = "async"
  }
  
  minio_replication = {
    source_bucket = "abran-prod-iran"
    target_bucket = "abran-prod-eu"
  }
}

# State Management
terraform {
  backend "s3" {
    bucket         = "abran-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "iran"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}`}
          </pre>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🔐 HashiCorp Vault</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`# Vault Configuration
vault server -config=/etc/vault/config.hcl

# Dynamic Secrets for PostgreSQL
vault write database/roles/abran-app \\
  db_name=postgres-prod \\
  creation_statements="CREATE ROLE..." \\
  default_ttl="1h" \\
  max_ttl="24h"

# Kubernetes Integration
vault write auth/kubernetes/role/abran-app \\
  bound_service_account_names=abran-app \\
  bound_service_account_namespaces=abran-prod \\
  policies=abran-app-policy \\
  ttl=24h

# Secret Rotation
vault write -force database/rotate-root/postgres-prod`}
          </pre>
        </div>
      </Card>
    </section>
  );
}

// ==================== GitOps & Deployment ====================
function GitOpsDeployment() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <GitBranch className="w-7 h-7 text-purple-400" />
          GitOps & Deployment Strategy
        </h2>
        <p className="text-gray-400">ArgoCD و استراتژی‌های deployment</p>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🔄 Promotion Pipeline</h3>
        <div className="bg-[#050816] rounded-xl p-6 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-blue-400 font-bold mb-2">
                Dev
              </div>
              <p className="text-xs text-gray-400">Development</p>
            </div>
            <span className="text-gray-500 text-2xl">→</span>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400 font-bold mb-2">
                Stg
              </div>
              <p className="text-xs text-gray-400">Staging</p>
            </div>
            <span className="text-gray-500 text-2xl">→</span>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 font-bold mb-2">
                Prod
              </div>
              <p className="text-xs text-gray-400">Production</p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🚀 ArgoCD Configuration</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`# argocd/applications/abran-api.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: abran-api
  namespace: argocd
spec:
  project: abran-prod
  
  source:
    repoURL: https://github.com/abran-system/abran-infra
    targetRevision: main
    path: helm/abran-api
    
  destination:
    server: https://kubernetes.default.svc
    namespace: abran-prod
    
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
      
# Blue/Green Deployment Strategy
---
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: abran-api
spec:
  strategy:
    blueGreen:
      activeService: abran-api-active
      previewService: abran-api-preview
      autoPromotionEnabled: false
      autoPromotionSeconds: 300
      
  # Automated Rollback
  rollbackWindow:
    revisions: 3`}
          </pre>
        </div>
      </Card>
    </section>
  );
}

// ==================== Security Hardening ====================
function SecurityHardening() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Shield className="w-7 h-7 text-red-400" />
          Production Security & Compliance
        </h2>
        <p className="text-gray-400">امنیت production و compliance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <h3 className="text-sm font-bold text-emerald-400 mb-2">🌐 Public Plane</h3>
          <ul className="space-y-1 text-xs text-gray-300">
            <li>✓ Cloudflare WAF</li>
            <li>✓ DDoS Protection</li>
            <li>✓ CDN Caching</li>
            <li>✓ TLS 1.3 Enforced</li>
          </ul>
        </Card>
        <Card>
          <h3 className="text-sm font-bold text-amber-400 mb-2">🔒 Admin Plane</h3>
          <ul className="space-y-1 text-xs text-gray-300">
            <li>✓ IP Allowlist</li>
            <li>✓ Mandatory MFA</li>
            <li>✓ Device Trust</li>
            <li>✓ No Public Access</li>
          </ul>
        </Card>
        <Card>
          <h3 className="text-sm font-bold text-blue-400 mb-2">🛡️ Internal Plane</h3>
          <ul className="space-y-1 text-xs text-gray-300">
            <li>✓ mTLS (Istio)</li>
            <li>✓ Network Policies</li>
            <li>✓ Namespace Isolation</li>
            <li>✓ Zero Trust</li>
          </ul>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🔐 mTLS Configuration (Istio)</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`# Strict mTLS for all services
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: abran-prod
spec:
  mtls:
    mode: STRICT

# Network Policies
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-ingress
  namespace: abran-prod
spec:
  podSelector: {}
  policyTypes:
    - Ingress
  ingress: []

# Allow only from API Gateway
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api-gateway
  namespace: abran-prod
spec:
  podSelector:
    matchLabels:
      app: abran-api
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: istio-system`}
          </pre>
        </div>
      </Card>
    </section>
  );
}

// ==================== Observability ====================
function Observability() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Activity className="w-7 h-7 text-cyan-400" />
          Observability, Monitoring & Alerting
        </h2>
        <p className="text-gray-400">پایش کامل سیستم با Prometheus، Loki و Grafana</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-3xl mb-2">📊</div>
          <h3 className="text-white font-bold mb-1">Prometheus</h3>
          <p className="text-xs text-gray-400">Metrics collection & VictoriaMetrics for long-term storage</p>
        </Card>
        <Card>
          <div className="text-3xl mb-2">📝</div>
          <h3 className="text-white font-bold mb-1">Loki</h3>
          <p className="text-xs text-gray-400">Centralized log aggregation with traceId correlation</p>
        </Card>
        <Card>
          <div className="text-3xl mb-2">🔍</div>
          <h3 className="text-white font-bold mb-1">Tempo</h3>
          <p className="text-xs text-gray-400">Distributed tracing via OpenTelemetry</p>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🚨 Critical Alerts</h3>
        <div className="space-y-2">
          {[
            { alert: 'API Latency > 300ms (p95)', severity: 'critical', channel: 'PagerDuty' },
            { alert: 'Error Rate > 1%', severity: 'critical', channel: 'PagerDuty' },
            { alert: 'NATS Consumer Lag > 1000', severity: 'high', channel: 'Slack' },
            { alert: 'DB Replication Delay > 5s', severity: 'high', channel: 'Slack' },
            { alert: 'Disk Usage > 80%', severity: 'warning', channel: 'Telegram' },
            { alert: 'Memory Usage > 85%', severity: 'warning', channel: 'Telegram' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <AlertTriangle className={`w-4 h-4 ${
                item.severity === 'critical' ? 'text-red-400' :
                item.severity === 'high' ? 'text-amber-400' : 'text-yellow-400'
              }`} />
              <div className="flex-1">
                <p className="text-sm text-white">{item.alert}</p>
                <p className="text-xs text-gray-400">→ {item.channel}</p>
              </div>
              <Badge variant={
                item.severity === 'critical' ? 'error' :
                item.severity === 'high' ? 'warning' : 'default'
              } size="sm">
                {item.severity}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

// ==================== Disaster Recovery ====================
function DisasterRecovery() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Database className="w-7 h-7 text-orange-400" />
          Disaster Recovery & Backup
        </h2>
        <p className="text-gray-400">استراتژی backup و disaster recovery</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="text-center">
          <div className="text-4xl font-black text-emerald-400 mb-2">{'< 15 min'}</div>
          <h3 className="text-white font-bold mb-1">RTO</h3>
          <p className="text-gray-400 text-sm">Recovery Time Objective</p>
        </Card>
        <Card className="text-center">
          <div className="text-4xl font-black text-blue-400 mb-2">{'< 5 min'}</div>
          <h3 className="text-white font-bold mb-1">RPO</h3>
          <p className="text-gray-400 text-sm">Recovery Point Objective</p>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">💾 Backup Strategy</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`# PostgreSQL Backup with WAL-G
wal-g backup-push /var/lib/postgresql/16/main

# Encrypted & Immutable Backups
aws s3 cp backup.tar.gz s3://abran-backups/ \\
  --sse AES256 \\
  --metadata "immutable=true"

# Cross-Region Replication
# Iranian DC → European DC
aws s3 sync s3://abran-backups-iran \\
  s3://abran-backups-eu \\
  --source-region iran \\
  --region eu-central-1

# Automated Backup Schedule
# - Hourly: WAL archives
# - Daily: Full backup
# - Weekly: Cross-region replication
# - Monthly: Long-term archive (1 year)`}
          </pre>
        </div>
      </Card>
    </section>
  );
}

// ==================== Go-Live Runbook ====================
function GoLiveRunbook() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Rocket className="w-7 h-7 text-pink-400" />
          Go-Live Runbook & Rollback Plan
        </h2>
        <p className="text-gray-400">برنامه launch و rollback</p>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🚀 Go-Live Timeline</h3>
        <div className="bg-[#050816] rounded-xl p-6 border border-white/5">
          <div className="space-y-4">
            {[
              { time: 'T-60 min', action: 'Lower DNS TTL to 60s', status: 'pending' },
              { time: 'T-30 min', action: 'Final database migration', status: 'pending' },
              { time: 'T-15 min', action: 'Deploy to production (Blue/Green)', status: 'pending' },
              { time: 'T-0', action: 'Switch DNS to production', status: 'pending' },
              { time: 'T+5 min', action: 'Canary: 10% traffic', status: 'pending' },
              { time: 'T+15 min', action: 'Canary: 50% traffic', status: 'pending' },
              { time: 'T+30 min', action: 'Full traffic (100%)', status: 'pending' },
              { time: 'T+60 min', action: 'Post-launch smoke tests', status: 'pending' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <Badge variant="info" size="sm" className="font-mono w-20 justify-center">
                  {item.time}
                </Badge>
                <span className="text-sm text-gray-300 flex-1">{item.action}</span>
                <Badge variant="default" size="sm">⏳ Pending</Badge>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">⏪ Rollback Triggers</h3>
        <div className="space-y-2">
          {[
            { trigger: 'Error rate > 5% for 5 minutes', action: 'Immediate rollback' },
            { trigger: 'API latency p95 > 500ms for 10 minutes', action: 'Rollback to previous version' },
            { trigger: 'Database connection failures > 10', action: 'Rollback + investigate' },
            { trigger: 'NATS consumer lag > 10000', action: 'Scale up + monitor' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-white">{item.trigger}</p>
                <p className="text-xs text-red-300">→ {item.action}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

// ==================== Final Report ====================
function FinalReport() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <FileText className="w-7 h-7 text-emerald-400" />
          Phase 6 Readiness Sign-Off
        </h2>
        <p className="text-gray-400">گزارش نهایی آمادگی production</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/30">
          <div className="text-5xl font-black text-emerald-400 mb-2">96</div>
          <h3 className="text-white font-bold mb-1">Health Score</h3>
          <p className="text-gray-400 text-sm">از 100</p>
        </Card>
        <Card className="text-center bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/30">
          <div className="text-5xl font-black text-blue-400 mb-2">99.95%</div>
          <h3 className="text-white font-bold mb-1">Availability</h3>
          <p className="text-gray-400 text-sm">SLO Target</p>
        </Card>
        <Card className="text-center bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/30">
          <div className="text-5xl font-black text-purple-400 mb-2">2 DCs</div>
          <h3 className="text-white font-bold mb-1">Multi-Region</h3>
          <p className="text-gray-400 text-sm">Iran + Europe</p>
        </Card>
        <Card className="text-center bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/30">
          <div className="text-5xl font-black text-amber-400 mb-2">100%</div>
          <h3 className="text-white font-bold mb-1">Ready</h3>
          <p className="text-gray-400 text-sm">Go-Live</p>
        </Card>
      </div>

      <Alert variant="success" title="✅ سیستم آماده Go-Live است">
        <ul className="space-y-1 text-sm">
          <li>• Production infrastructure provisioned (Iran + Europe)</li>
          <li>• HashiCorp Vault deployed with dynamic secrets</li>
          <li>• ArgoCD managing deployments via GitOps</li>
          <li>• Blue/Green deployments tested</li>
          <li>• mTLS enforced between all services</li>
          <li>• Admin Plane isolated (IP Allowlist + MFA)</li>
          <li>• WAF and DDoS protection active</li>
          <li>• Data residency rules enforced</li>
          <li>• Prometheus, Loki, Tempo collecting data</li>
          <li>• Grafana dashboards built</li>
          <li>• Critical alerts configured</li>
          <li>• Automated backups running</li>
          <li>• Go-Live Runbook documented</li>
          <li>• Rollback Plan ready</li>
          <li>• Operational SOPs written</li>
          <li>• Dry run completed successfully</li>
        </ul>
      </Alert>

      <Card className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border-emerald-500/30">
        <h3 className="text-xl font-bold text-white mb-4">🎉 ABRAN SYSTEM is LIVE!</h3>
        <p className="text-gray-300 mb-4">
          فاز ۶ با موفقیت تکمیل شد. سیستم ABRAN اکنون در production فعال است و آماده
          خدمت‌رسانی به هزاران کاربر در ایران و اروپا می‌باشد.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div>
            <h4 className="text-sm font-semibold text-emerald-400 mb-2">Production URLs</h4>
            <ul className="space-y-1 text-xs text-gray-300 font-mono" dir="ltr">
              <li>• web.abran.ir</li>
              <li>• customer.abran.ir</li>
              <li>• reseller.abran.ir</li>
              <li>• admin.abran.ir</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-400 mb-2">Next Phases</h4>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>• Phase 7: Financial Context</li>
              <li>• Phase 8-10: Enhancements</li>
              <li>• Phase 11: Analytics & BI</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-purple-400 mb-2">Monitoring</h4>
            <ul className="space-y-1 text-xs text-gray-300 font-mono" dir="ltr">
              <li>• grafana.abran.internal</li>
              <li>• prometheus.abran.internal</li>
              <li>• alertmanager.abran.internal</li>
            </ul>
          </div>
        </div>
      </Card>
    </section>
  );
}

// ==================== Main Page ====================
export function Phase6Production() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900/30 via-[#0a0f1f] to-blue-900/30 border border-white/10 p-10">
        <div className="absolute inset-0 grid-pattern opacity-30"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

        <div className="relative">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white">فاز ۶: Production Release</h1>
              <p className="text-emerald-300 text-lg">Go-Live & Operational Readiness</p>
            </div>
          </div>

          <p className="text-gray-300 max-w-3xl leading-relaxed text-lg mb-6">
            استقرار در production environments (ایران و اروپا)، پیاده‌سازی GitOps با ArgoCD،
            پیکربندی disaster recovery، و آماده‌سازی operational runbooks برای launch موفق.
          </p>

          <div className="flex gap-3 flex-wrap">
            {['Production Ready', 'Multi-Region', 'GitOps', 'Zero Trust', '99.95% SLA', 'Go-Live'].map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-medium border border-emerald-500/30">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sections */}
      <PreFlightValidation />
      <ProductionInfrastructure />
      <GitOpsDeployment />
      <SecurityHardening />
      <Observability />
      <DisasterRecovery />
      <GoLiveRunbook />
      <FinalReport />
    </div>
  );
}
