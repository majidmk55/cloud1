import { useState } from 'react';

interface ADR {
  id: string;
  title: string;
  status: string;
  context: string;
  decision: string;
  consequences: string[];
  alternatives: string[];
}

const adrs: ADR[] = [
  {
    id: '0001',
    title: 'Modular Monolith Architecture',
    status: 'Accepted',
    context: 'ABRAN SYSTEM is a greenfield cloud platform targeting the Iranian market with B2C/B2B services. The team is small (3-5 developers initially), and time-to-market is critical. We need an architecture that supports rapid development while being future-proof enough to evolve into microservices when the team and traffic grow.\n\nKey constraints:\n- Small team, limited DevOps capacity\n- Need to ship MVP within 3-4 months\n- Must support 9 distinct business domains\n- Future migration to microservices is planned but not immediate\n- Iranian infrastructure constraints (hosting, latency, sanctions)',
    decision: 'Adopt a Modular Monolith architecture with hard Bounded Contexts. Each module:\n- Has its own database schema (namespaced tables)\n- Exposes a public API via TypeScript interfaces (contracts)\n- Communicates with other modules via domain events\n- Cannot import internal code from other modules (enforced by linting)\n- Is deployable as a standalone service in the future (no shared state)\n\nThe monolith runs as a single NestJS process but is logically partitioned into 9 modules that mirror the future microservice boundaries.',
    consequences: [
      '✅ Faster development — no network overhead, single deployment',
      '✅ Simpler debugging — all code in one process, easy stack traces',
      '✅ Lower DevOps burden — one service to monitor, one CI/CD pipeline',
      '✅ Future-proof — modules can be extracted to microservices with minimal refactoring',
      '✅ Team autonomy — each developer can own a module',
      '⚠️ Requires discipline — developers must respect module boundaries',
      '⚠️ Single deployment unit — any change requires full redeployment',
      '⚠️ Scaling is all-or-nothing — cannot scale individual modules independently',
    ],
    alternatives: [
      'Microservices from day one — Rejected: too much operational complexity for a small team, 3-6 months overhead for infrastructure alone',
      'Monolith with no module boundaries — Rejected: would create a big ball of mud, impossible to extract later',
      'SOA (Service-Oriented Architecture) — Rejected: outdated pattern, lacks the clear boundaries of modular monolith',
    ],
  },
  {
    id: '0002',
    title: 'Bounded Contexts Definition',
    status: 'Accepted',
    context: 'The ABRAN SYSTEM domain is complex with 9 distinct business capabilities. Without clear boundaries, the codebase will become unmaintainable. We need to define explicit Bounded Contexts that map to business capabilities, each with clear ownership, data boundaries, and communication patterns.\n\nThe contexts must be:\n- Aligned with business domains (not technical layers)\n- Independently deployable in the future\n- Have clear data ownership (no shared tables)\n- Communicate via well-defined contracts',
    decision: 'Define 9 Bounded Contexts with hard boundaries:\n\n1. Identity — User auth, profiles, sessions, roles, API keys\n2. Ordering — Catalog, cart, orders, checkout, pricing snapshots\n3. Provisioning — Service deployment, provider communication, resource allocation\n4. Lifecycle — Active service management, upgrades, renewals, suspensions\n5. Financial — Wallets, payments, invoices, refunds, ledger (strong consistency)\n6. Inventory — Resource availability, capacity, provider stock sync (eventually consistent)\n7. Config — Service plans, pricing rules, feature flags, system settings\n8. Provider-Intelligence — Provider health, performance metrics, cost optimization, routing\n9. Analytics — BI, dashboards, usage metrics, KPIs (deferred to Phase 11)\n\nEach context owns its database tables (prefixed: identity_*, ordering_*, etc.), exposes a public TypeScript interface, and publishes domain events.',
    consequences: [
      '✅ Clear ownership — each context has a single responsible team/developer',
      '✅ Independent evolution — contexts can change at different speeds',
      '✅ Data isolation — no accidental cross-context queries',
      '✅ Testability — each context can be tested in isolation',
      '⚠️ Eventual consistency between contexts — requires careful design',
      '⚠️ More complex queries — cannot JOIN across contexts',
      '⚠️ Data duplication — some data may be duplicated for read performance',
    ],
    alternatives: [
      'Single shared database — Rejected: violates isolation, creates coupling',
      'Fewer contexts (3-4) — Rejected: too coarse, would create large modules',
      'More contexts (15+) — Rejected: too fine-grained for MVP, excessive communication overhead',
      'Context mapping by technical layer — Rejected: must be business-aligned, not technical',
    ],
  },
  {
    id: '0003',
    title: 'Event Schema Versioning Strategy',
    status: 'Accepted',
    context: 'ABRAN SYSTEM uses domain events for inter-context communication. As the system evolves, event schemas will change. We need a strategy for:\n- Versioning event schemas\n- Ensuring backward/forward compatibility\n- Handling schema evolution without breaking consumers\n- Supporting multiple schema versions during transitions\n\nThe system will eventually use NATS JetStream for event transport, but the schema strategy must work regardless of the transport mechanism.',
    decision: 'Use JSON Schema for event validation (not Avro or Protobuf) with the following rules:\n\nCompatibility Rules:\n- BACKWARD compatible (default): New schema can read old data. Adding optional fields is allowed. Removing fields requires a deprecation period.\n- FORWARD compatible: Old schema can read new data. Consumers must ignore unknown fields.\n- FULL compatible: Both backward and forward. Required for Financial events.\n\nVersioning Strategy:\n- Schema version = {context}.{event}.{version} (e.g., ordering.order.created.v1)\n- Breaking changes create a new major version (v2, v3)\n- Non-breaking changes increment minor version (v1.1, v1.2)\n\nDual-Publish Policy:\n- When introducing a new event version, publish BOTH old and new versions for 90 days\n- Consumers must migrate within 90 days\n- After 90 days, old version is deprecated and removed in the next major release\n\nSchema Registry:\n- All event schemas stored in packages/events/schemas/\n- CI validates schema compatibility on every PR\n- Breaking changes require ADR approval',
    consequences: [
      '✅ Safe evolution — consumers never break unexpectedly',
      '✅ Clear migration path — 90-day dual-publish window',
      '✅ CI enforcement — incompatible changes caught before merge',
      '✅ JSON-based — easy to debug, no special tooling required',
      '⚠️ Larger event payloads — JSON is verbose compared to binary formats',
      '⚠️ No built-in code generation — must write TypeScript types manually',
      '⚠️ 90-day dual-publish adds temporary storage overhead',
    ],
    alternatives: [
      'Apache Avro — Rejected: requires schema registry service, binary format harder to debug, overkill for MVP',
      'Protocol Buffers — Rejected: requires protobuf tooling, less flexible for JSON-native systems',
      'No versioning — Rejected: would break consumers on any schema change',
      'CloudEvents spec — Considered for Phase 2, adds complexity not needed for MVP',
    ],
  },
  {
    id: '0004',
    title: 'Consistency Models per Context',
    status: 'Accepted',
    context: 'Different contexts have different consistency requirements:\n- Financial operations (payments, wallet balances) must be strongly consistent — money cannot be lost or double-spent\n- Inventory availability can be eventually consistent — slight delays are acceptable\n- Service lifecycle events can be eventually consistent — a few seconds delay is acceptable\n- Configuration changes should propagate quickly but don\'t need immediate consistency\n\nWe need to define which consistency model applies to each context and how to implement reconciliation when eventual consistency is used.',
    decision: 'Apply two consistency models based on context criticality:\n\nStrong Consistency (Financial context only):\n- All financial operations use database transactions with SERIALIZABLE isolation\n- Wallet balances use optimistic locking (version field)\n- Double-entry bookkeeping — every transaction has equal debits and credits\n- Reconciliation runs every 5 minutes to verify ledger integrity\n- No eventual consistency allowed — if a transaction cannot be strongly consistent, it fails\n\nEventual Consistency (all other contexts):\n- Inter-context communication via async events (NATS JetStream)\n- Maximum acceptable delay: 5 seconds for critical operations, 30 seconds for non-critical\n- Each context maintains its own read model (projections)\n- Idempotent event handlers — safe to replay events\n\nReconciliation Loop:\n- Runs every 15 minutes for Inventory (sync with provider stock)\n- Runs every hour for Lifecycle (verify service states match provisioning)\n- Runs every 5 minutes for Financial (verify ledger integrity)\n- Alerts on divergence > threshold\n- Auto-retry with exponential backoff for failed reconciliations',
    consequences: [
      '✅ Financial safety — money operations are always correct',
      '✅ Performance — eventual consistency allows high throughput for non-critical operations',
      '✅ Clear rules — developers know which model applies to their context',
      '✅ Automatic recovery — reconciliation catches and fixes drift',
      '⚠️ Complexity — two consistency models increase cognitive load',
      '⚠️ Reconciliation overhead — background jobs consume resources',
      '⚠️ Debugging eventual consistency — harder to trace event flows',
    ],
    alternatives: [
      'Strong consistency everywhere — Rejected: too slow, would bottleneck the system',
      'Eventual consistency everywhere — Rejected: unacceptable for financial operations',
      'Saga pattern for all distributed transactions — Rejected: overkill for MVP, use for Phase 2',
      'CQRS everywhere — Rejected: too complex for MVP, apply only to Financial and Inventory',
    ],
  },
  {
    id: '0005',
    title: 'Admin RBAC — 3-Level Permission Model',
    status: 'Accepted',
    context: 'The Admin Portal requires role-based access control with 3 distinct levels. Each level has different permissions and responsibilities. We need to define:\n- What each role can do\n- How permissions are enforced\n- How to handle permission changes\n- Audit logging for admin actions',
    decision: 'Implement a 3-level RBAC model for the Admin Portal:\n\nSuper Admin:\n- Full system access — all features, all contexts\n- Can create/modify/delete other admin accounts\n- Can modify system configuration and feature flags\n- Can access Financial reports and modify pricing\n- Can view all user data and audit logs\n- Can perform destructive operations (delete services, terminate accounts)\n- MFA required\n\nAdmin:\n- Access to operational features — service management, user support, order processing\n- Can view (but not modify) system configuration\n- Can issue refunds up to a configurable limit\n- Can suspend/activate user accounts\n- Cannot modify pricing or system-level settings\n- Cannot delete other admin accounts\n- MFA recommended\n\nOperator:\n- Read-only access to dashboards and reports\n- Can view service status and user information\n- Can create support tickets\n- Cannot modify any data\n- Cannot access Financial module\n- No MFA required\n\nImplementation:\n- Permissions stored in Identity context (role → permission mapping)\n- Middleware enforces permissions on every API call\n- All admin actions logged with actor, action, resource, timestamp, IP\n- Permission changes require Super Admin approval\n- Session tokens include role claims (refreshed every 15 minutes)',
    consequences: [
      '✅ Clear separation of duties — each role has appropriate access',
      '✅ Audit trail — all admin actions logged',
      '✅ Security — MFA for privileged roles',
      '✅ Flexibility — permissions can be adjusted without code changes',
      '⚠️ Complexity — 3 levels require careful permission matrix design',
      '⚠️ Token refresh — 15-minute refresh adds slight latency',
      '⚠️ Audit storage — logs grow over time, need rotation policy',
    ],
    alternatives: [
      '2-level (Admin / Operator) — Rejected: insufficient granularity, Super Admin needed for system-level changes',
      '4+ levels — Rejected: over-engineering for current team size',
      'ABAC (Attribute-Based Access Control) — Rejected: too complex for MVP, consider for Phase 2',
      'No RBAC (all admins equal) — Rejected: security risk, no separation of duties',
    ],
  },
  {
    id: '0006',
    title: 'Service Visibility Toggle',
    status: 'Accepted',
    context: 'Services in the catalog need different visibility states:\n- Some services are publicly available\n- Some are hidden (available only via direct link or API)\n- Some are deprecated (no new purchases, existing services continue)\n- Some are invite-only (available only to specific customers)\n\nWe need a unified mechanism to control service visibility across the catalog, checkout, and active service management.',
    decision: 'Implement a 4-state visibility toggle for all services:\n\nPublic:\n- Visible in catalog, searchable, purchasable by anyone\n- Default state for new services\n- Appears in pricing pages and marketing\n\nHidden:\n- Not visible in catalog or search\n- Purchasable via direct link or API (e.g., ?service_id=xyz)\n- Used for beta services, partner-specific offerings, or internal testing\n- Existing customers can still manage their instances\n\nDeprecated:\n- Not visible in catalog, not purchasable by anyone (including direct link)\n- Existing customers retain access to their instances\n- No new orders accepted\n- Migration path should be provided (notification, alternative service)\n- Auto-notify customers after 90 days with migration options\n\nInvite-Only:\n- Not visible in catalog or search\n- Purchasable only by invited customers (whitelist)\n- Used for premium services, enterprise offerings, or early access\n- Invite managed via Admin Portal\n- Existing customers can still manage their instances\n\nImplementation:\n- Visibility state stored in Config context (service_plan.visibility)\n- Catalog API filters by visibility + user permissions\n- Checkout validates visibility at order time (race condition protection)\n- Lifecycle ignores visibility (existing services always accessible)\n- Admin Portal allows bulk visibility changes',
    consequences: [
      '✅ Flexibility — support all business scenarios (beta, deprecated, premium)',
      '✅ Clean catalog — customers only see relevant services',
      '✅ Graceful deprecation — existing customers not disrupted',
      '✅ Revenue protection — invite-only enables premium pricing',
      '⚠️ Complexity — 4 states require careful testing of all combinations',
      '⚠️ Race conditions — visibility can change between catalog view and checkout',
      '⚠️ Deprecation management — need notification system and migration tools',
    ],
    alternatives: [
      '2-state (visible/hidden) — Rejected: insufficient for deprecation and invite-only scenarios',
      '3-state (visible/hidden/deprecated) — Rejected: no support for invite-only premium services',
      'Per-customer visibility lists — Rejected: too complex to manage, use invite-only state instead',
      'No visibility control — Rejected: cannot support beta, deprecated, or premium services',
    ],
  },
  {
    id: '0007',
    title: 'Turborepo + pnpm Monorepo Strategy',
    status: 'Accepted',
    context: 'ABRAN SYSTEM is a monorepo containing:\n- 5 apps (web, customer-portal, reseller-portal, admin-portal, api)\n- 9 modules (identity, ordering, provisioning, lifecycle, financial, inventory, config, provider-intelligence, analytics)\n- 7 shared packages (contracts, events, auth, database, observability, ui, config)\n- Infrastructure code (terraform, kubernetes, helm, ansible)\n- Documentation\n\nWe need a monorepo tool that:\n- Handles complex dependency graphs efficiently\n- Provides fast incremental builds\n- Supports multiple package managers (pnpm preferred)\n- Has good TypeScript support\n- Integrates with CI/CD',
    decision: 'Use Turborepo + pnpm workspaces as the monorepo solution:\n\nWhy Turborepo:\n- Zero-config caching — automatic build cache based on file hashes\n- Parallel execution — builds independent packages in parallel\n- Remote caching — share build cache across CI and developers\n- Simple configuration — turbo.json defines the pipeline\n- Native pnpm support — works seamlessly with pnpm workspaces\n- Fast — written in Rust, significantly faster than Nx or Lerna\n\nWhy pnpm:\n- Disk-efficient — hard links and symlinks reduce node_modules size\n- Fast — parallel installation, efficient dependency resolution\n- Strict — prevents phantom dependencies (unlike npm/yarn)\n- Workspaces — native monorepo support\n- Compatible — works with all npm packages\n\nWorkspace Structure:\n- apps/* — Deployable applications (Next.js, NestJS)\n- modules/* — Business logic modules (imported by apps/api)\n- packages/* — Shared libraries (imported by apps and modules)\n- infrastructure/* — IaC code (not part of build pipeline)\n- docs/* — Documentation (not part of build pipeline)\n\nBuild Pipeline (turbo.json):\n- build — depends on ^build (build dependencies first)\n- dev — persistent task, no caching\n- test — depends on build\n- lint — no dependencies, parallel\n- typecheck — depends on ^typecheck, no caching',
    consequences: [
      '✅ Fast builds — incremental builds with caching save 60-80% CI time',
      '✅ Simple setup — minimal configuration, easy to understand',
      '✅ Great DX — fast feedback loop for developers',
      '✅ CI-friendly — remote caching reduces CI costs',
      '⚠️ Rust-based — less extensible than JavaScript-based tools',
      '⚠️ Smaller ecosystem — fewer plugins compared to Nx',
      '⚠️ Learning curve — team must understand Turborepo concepts',
    ],
    alternatives: [
      'Nx — Rejected: more complex setup, overkill for our needs, slower for simple tasks',
      'Lerna — Rejected: deprecated, no caching, slow builds',
      'Yarn workspaces only — Rejected: no build orchestration, no caching',
      'Bazel — Rejected: too complex, steep learning curve, overkill for TypeScript monorepo',
      'Separate repositories — Rejected: loses atomic commits, shared code becomes painful',
    ],
  },
  {
    id: '0008',
    title: 'Deferred Technologies — Temporal, Keycloak, NATS, Kubernetes',
    status: 'Accepted',
    context: 'Several powerful technologies were considered for the ABRAN SYSTEM but are not needed for MVP:\n- Temporal — Workflow orchestration for complex, long-running processes\n- Keycloak — Identity and access management (OIDC/OAuth 2.1)\n- NATS JetStream — High-performance messaging\n- Kubernetes — Container orchestration at scale\n\nAdopting all of these at once would:\n- Add 3-6 months of infrastructure setup\n- Increase operational complexity significantly\n- Require specialized knowledge the team doesn\'t have yet\n- Delay time-to-market unacceptably\n\nWe need to ship MVP first, then adopt these technologies when the need is proven.',
    decision: 'Explicitly defer these technologies to later phases:\n\nTemporal → Phase 3 (after MVP):\n- MVP uses: PostgreSQL Outbox pattern + BullMQ for job queues\n- Simple state machines in code (not persisted workflows)\n- Provisioning uses a basic state machine (created → provisioning → active → suspended → terminated)\n- When to adopt: When workflow complexity exceeds 5 states or requires human-in-the-loop\n\nKeycloak → Phase 1 (after initial auth):\n- MVP uses: Custom JWT authentication (issued by Identity context)\n- Simple password hashing (bcrypt) + email verification\n- Basic MFA (TOTP) implemented in Identity context\n- When to adopt: When SSO, social login, or complex federation is needed\n\nNATS JetStream → Phase 2 (after event volume grows):\n- MVP uses: PostgreSQL Outbox + polling for inter-context events\n- In-memory event bus for development (EventEmitter)\n- When to adopt: When event volume exceeds 1000 events/second or multi-instance deployment\n\nKubernetes → Phase 4 (after traffic growth):\n- MVP uses: Docker Compose for development, single-server deployment for staging\n- Manual deployment scripts for production\n- When to adopt: When horizontal scaling is needed or multi-region deployment required\n\nInterface Scaffolding:\n- All deferred technologies have interface definitions in packages/\n- Adapter pattern allows swapping implementations later\n- Example: packages/auth/src/adapter.ts defines AuthAdapter interface\n- MVP implements SimpleJWTAdapter; Phase 1 implements KeycloakAdapter',
    consequences: [
      '✅ Faster MVP — 3-6 months saved on infrastructure',
      '✅ Lower complexity — team focuses on business logic, not DevOps',
      '✅ Proven adoption — technologies adopted when need is clear, not hypothetical',
      '✅ Easier onboarding — new developers learn simpler stack first',
      '⚠️ Technical debt — will need to migrate later (mitigated by interfaces)',
      '⚠️ Limited features — no SSO, no advanced workflows, no auto-scaling initially',
      '⚠️ Manual operations — deployment and scaling require manual intervention',
    ],
    alternatives: [
      'Adopt all technologies from day one — Rejected: too much complexity, delays MVP by 3-6 months',
      'Adopt some technologies (e.g., Keycloak only) — Rejected: partial adoption still adds complexity without full benefit',
      'Use simpler alternatives permanently — Rejected: Temporal and K8s are industry standard, worth adopting later',
      'Use managed services (e.g., Auth0 instead of Keycloak) — Considered for Phase 1, but Keycloak provides more control for Iranian market',
    ],
  },
];

export function ADRs() {
  const [expandedADR, setExpandedADR] = useState<string | null>('0001');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <span>📋</span> Architecture Decision Records
        </h1>
        <p className="text-gray-400 mt-2 max-w-2xl">
          ADRs document significant architectural decisions, their context, and consequences.
          Each ADR follows the template: Title, Status, Context, Decision, Consequences, Alternatives.
        </p>
      </div>

      {/* ADR List */}
      <div className="space-y-4">
        {adrs.map((adr) => (
          <div
            key={adr.id}
            className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden transition-all"
          >
            {/* Header */}
            <button
              onClick={() => setExpandedADR(expandedADR === adr.id ? null : adr.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-gray-500 bg-gray-800 px-2 py-1 rounded">
                  ADR-{adr.id}
                </span>
                <h3 className="text-white font-semibold">{adr.title}</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30">
                  {adr.status}
                </span>
                <span className={`text-gray-400 transition-transform ${expandedADR === adr.id ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
            </button>

            {/* Content */}
            {expandedADR === adr.id && (
              <div className="px-6 pb-6 space-y-6 border-t border-gray-800 pt-6">
                {/* Context */}
                <div>
                  <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">Context</h4>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{adr.context}</p>
                </div>

                {/* Decision */}
                <div>
                  <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">Decision</h4>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{adr.decision}</p>
                </div>

                {/* Consequences */}
                <div>
                  <h4 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-2">Consequences</h4>
                  <ul className="space-y-1.5">
                    {adr.consequences.map((c, i) => (
                      <li key={i} className="text-sm text-gray-300">{c}</li>
                    ))}
                  </ul>
                </div>

                {/* Alternatives */}
                <div>
                  <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">Alternatives Considered</h4>
                  <ul className="space-y-2">
                    {adr.alternatives.map((a, i) => (
                      <li key={i} className="text-sm text-gray-300">{a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
