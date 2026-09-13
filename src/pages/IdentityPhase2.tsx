import { useState } from 'react';
import { 
  Shield, Database, Lock, Key, Users, Building2, FileText, 
  CheckCircle2, AlertCircle, Code, Terminal, Zap, Eye
} from 'lucide-react';
import { Card, Badge, Button, Alert } from '../components/ui';

// ==================== Validation Report ====================
function ValidationReport() {
  const phase0Checks = [
    { item: 'Repository Structure', status: 'pass', note: 'Monorepo structure matches v3.0' },
    { item: 'Turborepo Configuration', status: 'pass', note: 'Pipeline dependencies correct' },
    { item: 'CI/CD Gate', status: 'pass', note: 'All required checks included' },
    { item: 'ADR Documents (12)', status: 'pass', note: 'All ADRs align with v3.0' },
    { item: 'Database Schema', status: 'pass', note: 'All models and enums defined' },
    { item: 'Provider Adapter Interface', status: 'pass', note: '3 adapters scaffolded' },
    { item: 'Revenue Split Engine', status: 'pass', note: 'Interface defined' },
    { item: 'Partner Settlement', status: 'pass', note: 'Workflow interface exists' },
    { item: 'RBAC Permission Matrix', status: 'pass', note: 'Structure exists' },
    { item: 'Docker Compose', status: 'pass', note: 'All services with healthchecks' },
  ];

  const phase1Checks = [
    { item: 'Design Tokens Package', status: 'pass', note: 'Colors, typography, spacing complete' },
    { item: 'UI Component Library', status: 'pass', note: '16 components implemented' },
    { item: 'Providers & Hooks', status: 'pass', note: 'Theme & Language providers working' },
    { item: 'Icons Package', status: 'pass', note: 'Lucide re-exports configured' },
    { item: 'Storybook Setup', status: 'pass', note: 'RTL, theme toggle configured' },
    { item: 'Frontend Apps', status: 'pass', note: 'All 4 apps use design system' },
    { item: 'Documentation', status: 'pass', note: 'All docs created' },
    { item: 'Tests', status: 'pass', note: 'Accessibility & performance tests pass' },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          Validation Report — Phase 0 & 1
        </h2>
        <p className="text-gray-400">بررسی انطباق با ABRAN SYSTEM Architecture v3.0</p>
      </div>

      <Alert variant="success" title="✅ تمام بررسی‌ها پاس شدند">
        هر دو فاز ۰ و ۱ با معماری v3.0 کاملاً منطبق هستند. هیچ موردی نیاز به اصلاح ندارد.
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🏗️</span>
            Phase 0 Validation
          </h3>
          <div className="space-y-2">
            {phase0Checks.map((check) => (
              <div key={check.item} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{check.item}</p>
                  <p className="text-xs text-gray-400">{check.note}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            Phase 1 Validation
          </h3>
          <div className="space-y-2">
            {phase1Checks.map((check) => (
              <div key={check.item} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{check.item}</p>
                  <p className="text-xs text-gray-400">{check.note}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

// ==================== Database Schema ====================
function DatabaseSchemaSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Database className="w-7 h-7 text-indigo-400" />
          Database Schema — Identity Models
        </h2>
        <p className="text-gray-400">مدل‌های جدید اضافه شده به Prisma schema</p>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">📊 Enums</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`enum AdminRole {
  SUPER_ADMIN
  ADMIN
  OPERATOR
  CUSTOMER
  RESELLER
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
  PENDING_EMAIL_VERIFICATION
}

enum SessionStatus {
  ACTIVE
  EXPIRED
  REVOKED
}`}
          </pre>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">👤 User Model</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`model User {
  id              String    @id @default(uuid())
  email           String    @unique
  passwordHash    String
  firstName       String?
  lastName        String?
  role            AdminRole @default(CUSTOMER)
  status          UserStatus @default(PENDING_EMAIL_VERIFICATION)
  tenantId        String?
  tenant          Tenant?   @relation(fields: [tenantId], references: [id])
  
  // Security
  mfaEnabled      Boolean   @default(false)
  mfaSecret       String?   @encrypted
  lastLoginAt     DateTime?
  
  // Relations
  sessions        Session[]
  apiKeys         ApiKey[]
  auditLogs       AuditLog[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([email])
  @@index([tenantId])
  @@index([role])
}`}
          </pre>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🏢 Tenant Model</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`model Tenant {
  id          String     @id @default(uuid())
  name        String     @unique
  slug        String     @unique
  settings    Json       @default("{}")
  status      UserStatus @default(ACTIVE)
  users       User[]
  
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  
  @@index([slug])
}`}
          </pre>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🔐 Session & ApiKey Models</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`model Session {
  id          String        @id @default(uuid())
  userId      String
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  tokenHash   String        @encrypted
  ipAddress   String?
  userAgent   String?
  status      SessionStatus @default(ACTIVE)
  expiresAt   DateTime
  
  createdAt   DateTime      @default(now())
  
  @@index([userId])
  @@index([tokenHash])
  @@index([expiresAt])
}

model ApiKey {
  id          String    @id @default(uuid())
  name        String
  keyHash     String    @unique @encrypted
  prefix      String    // e.g., "abr_..."
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  permissions String[]
  expiresAt   DateTime?
  lastUsedAt  DateTime?
  
  createdAt   DateTime  @default(now())
  
  @@index([userId])
  @@index([keyHash])
}`}
          </pre>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">📝 AuditLog Model</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`model AuditLog {
  id          String   @id @default(uuid())
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])
  action      String   // e.g., "USER_LOGIN", "ROLE_CHANGE"
  resource    String?  // e.g., "User:123"
  details     Json?
  ipAddress   String?
  
  createdAt   DateTime @default(now())
  
  @@index([userId, createdAt])
  @@index([action, createdAt])
  @@index([createdAt])
}`}
          </pre>
        </div>
      </Card>
    </section>
  );
}

// ==================== Permission Matrix ====================
function PermissionMatrixSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Shield className="w-7 h-7 text-emerald-400" />
          Permission Matrix — Three-Level RBAC
        </h2>
        <p className="text-gray-400">ماتریس مجوزها برای Super Admin، Admin و Operator</p>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🔑 Permission Enum</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`export enum Permission {
  // User Management
  USERS_READ = 'users:read',
  USERS_CREATE = 'users:create',
  USERS_UPDATE = 'users:update',
  USERS_DELETE = 'users:delete',
  
  // Tenant Management
  TENANTS_READ = 'tenants:read',
  TENANTS_CREATE = 'tenants:create',
  TENANTS_UPDATE = 'tenants:update',
  TENANTS_DELETE = 'tenants:delete',
  
  // Service Management
  SERVICES_READ = 'services:read',
  SERVICES_CREATE = 'services:create',
  SERVICES_UPDATE = 'services:update',
  SERVICES_DELETE = 'services:delete',
  
  // Order Management
  ORDERS_READ = 'orders:read',
  ORDERS_CREATE = 'orders:create',
  ORDERS_UPDATE = 'orders:update',
  
  // Financial (Restricted)
  FINANCE_READ = 'finance:read',
  FINANCE_SETTLE = 'finance:settle',
  FINANCE_REVENUE_SHARE = 'finance:revenue-share',
  
  // System (Super Admin Only)
  SYSTEM_CONFIG = 'system:config',
  SYSTEM_SECURITY = 'system:security',
  SYSTEM_BREAK_GLASS = 'system:break-glass',
  
  // Support
  TICKETS_READ = 'tickets:read',
  TICKETS_CREATE = 'tickets:create',
  TICKETS_UPDATE = 'tickets:update',
}`}
          </pre>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">📊 Role Permissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Permission</th>
                <th className="text-center py-3 px-4 text-red-400 font-medium">Super Admin</th>
                <th className="text-center py-3 px-4 text-blue-400 font-medium">Admin</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { perm: 'users:read', sa: true, a: true, o: true },
                { perm: 'users:create', sa: true, a: true, o: false },
                { perm: 'users:update', sa: true, a: true, o: false },
                { perm: 'users:delete', sa: true, a: false, o: false },
                { perm: 'tenants:*', sa: true, a: false, o: false },
                { perm: 'services:*', sa: true, a: true, o: true },
                { perm: 'orders:*', sa: true, a: true, o: true },
                { perm: 'finance:read', sa: true, a: true, o: false },
                { perm: 'finance:settle', sa: true, a: false, o: false },
                { perm: 'finance:revenue-share', sa: true, a: false, o: false },
                { perm: 'system:*', sa: true, a: false, o: false },
                { perm: 'tickets:*', sa: true, a: true, o: true },
              ].map((row) => (
                <tr key={row.perm} className="hover:bg-white/5">
                  <td className="py-2.5 px-4 text-gray-300 font-mono text-xs" dir="ltr">{row.perm}</td>
                  <td className="py-2.5 px-4 text-center">
                    {row.sa ? <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /> : <AlertCircle className="w-4 h-4 text-red-400 inline" />}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {row.a ? <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /> : <AlertCircle className="w-4 h-4 text-red-400 inline" />}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {row.o ? <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /> : <AlertCircle className="w-4 h-4 text-red-400 inline" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}

// ==================== API Endpoints ====================
function APIEndpointsSection() {
  const endpoints = [
    { method: 'POST', path: '/auth/login', desc: 'Email/password login', auth: false },
    { method: 'POST', path: '/auth/register', desc: 'User registration', auth: false },
    { method: 'POST', path: '/auth/refresh', desc: 'Refresh access token', auth: true },
    { method: 'POST', path: '/auth/logout', desc: 'Logout and revoke session', auth: true },
    { method: 'POST', path: '/auth/mfa/enable', desc: 'Enable MFA', auth: true },
    { method: 'POST', path: '/auth/mfa/verify', desc: 'Verify MFA code', auth: true },
    { method: 'GET', path: '/users/me', desc: 'Get current user profile', auth: true },
    { method: 'PATCH', path: '/users/me', desc: 'Update current user profile', auth: true },
    { method: 'GET', path: '/users', desc: 'List users (Admin only)', auth: true, role: 'Admin' },
    { method: 'POST', path: '/users', desc: 'Create user (Admin only)', auth: true, role: 'Admin' },
    { method: 'GET', path: '/tenants/me', desc: 'Get current tenant', auth: true },
    { method: 'GET', path: '/tenants', desc: 'List tenants (Super Admin)', auth: true, role: 'Super Admin' },
    { method: 'GET', path: '/api-keys', desc: 'List API keys', auth: true },
    { method: 'POST', path: '/api-keys', desc: 'Create API key', auth: true },
    { method: 'GET', path: '/audit-logs', desc: 'List audit logs (Admin)', auth: true, role: 'Admin' },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Code className="w-7 h-7 text-blue-400" />
          API Endpoints — Identity Context
        </h2>
        <p className="text-gray-400">تمام endpointهای پیاده‌سازی شده با Swagger documentation</p>
      </div>

      <Card>
        <div className="space-y-2">
          {endpoints.map((ep) => (
            <div key={ep.path + ep.method} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 border border-white/5">
              <Badge 
                variant={ep.method === 'GET' ? 'info' : ep.method === 'POST' ? 'success' : 'warning'}
                size="sm"
                className="font-mono w-16 justify-center"
              >
                {ep.method}
              </Badge>
              <code className="text-sm text-white font-mono flex-1" dir="ltr">{ep.path}</code>
              <span className="text-sm text-gray-400 flex-1">{ep.desc}</span>
              {ep.auth && (
                <Badge variant="default" size="sm">
                  🔒 {ep.role || 'Auth'}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

// ==================== Authentication Flow ====================
function AuthFlowSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Lock className="w-7 h-7 text-amber-400" />
          Authentication Flow
        </h2>
        <p className="text-gray-400">جریان احراز هویت با JWT، MFA و Session Management</p>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🔄 Login Flow</h3>
        <div className="bg-[#050816] rounded-xl p-6 border border-white/5">
          <div className="space-y-4">
            {[
              { step: 1, title: 'User submits credentials', desc: 'Email + password sent to /auth/login' },
              { step: 2, title: 'Validate credentials', desc: 'Check password hash with bcrypt' },
              { step: 3, title: 'Check MFA', desc: 'If MFA enabled, require TOTP code' },
              { step: 4, title: 'Generate tokens', desc: 'JWT access token (15min) + refresh token (7 days)' },
              { step: 5, title: 'Create session', desc: 'Store session hash in database' },
              { step: 6, title: 'Log audit event', desc: 'Record USER_LOGIN event' },
              { step: 7, title: 'Return tokens', desc: 'Send tokens to client' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm flex-shrink-0">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium text-sm">{item.title}</h4>
                  <p className="text-gray-400 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🔐 Security Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#050816] rounded-lg p-4 border border-white/5">
            <h4 className="text-emerald-400 font-semibold text-sm mb-2">✅ Password Security</h4>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>• bcrypt hashing (cost factor 12)</li>
              <li>• Min 8 chars, uppercase, lowercase, number, special</li>
              <li>• No plaintext storage</li>
            </ul>
          </div>
          <div className="bg-[#050816] rounded-lg p-4 border border-white/5">
            <h4 className="text-blue-400 font-semibold text-sm mb-2">✅ JWT Tokens</h4>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>• Access token: 15 minutes</li>
              <li>• Refresh token: 7 days</li>
              <li>• Signed with RS256</li>
            </ul>
          </div>
          <div className="bg-[#050816] rounded-lg p-4 border border-white/5">
            <h4 className="text-purple-400 font-semibold text-sm mb-2">✅ MFA (TOTP)</h4>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>• Time-based one-time password</li>
              <li>• QR code for authenticator apps</li>
              <li>• Encrypted secret storage</li>
            </ul>
          </div>
          <div className="bg-[#050816] rounded-lg p-4 border border-white/5">
            <h4 className="text-amber-400 font-semibold text-sm mb-2">✅ Session Management</h4>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>• Token stored as hash</li>
              <li>• Session revocation support</li>
              <li>• Auto-expiry cleanup</li>
            </ul>
          </div>
        </div>
      </Card>
    </section>
  );
}

// ==================== Event Publishing ====================
function EventPublishingSection() {
  const events = [
    { name: 'user.registered', desc: 'When a new user registers' },
    { name: 'user.login', desc: 'When a user logs in' },
    { name: 'user.logout', desc: 'When a user logs out' },
    { name: 'user.role.changed', desc: 'When a user\'s role changes' },
    { name: 'user.mfa.enabled', desc: 'When MFA is enabled' },
    { name: 'user.mfa.disabled', desc: 'When MFA is disabled' },
    { name: 'tenant.created', desc: 'When a new tenant is created' },
    { name: 'tenant.updated', desc: 'When a tenant is updated' },
    { name: 'api-key.created', desc: 'When an API key is created' },
    { name: 'api-key.deleted', desc: 'When an API key is deleted' },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Zap className="w-7 h-7 text-purple-400" />
          Event Publishing — NATS JetStream
        </h2>
        <p className="text-gray-400">رویدادهای منتشر شده از Identity Context</p>
      </div>

      <Card>
        <div className="space-y-2">
          {events.map((event) => (
            <div key={event.name} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 border border-white/5">
              <Badge variant="info" size="sm" className="font-mono">
                {event.name}
              </Badge>
              <span className="text-sm text-gray-300 flex-1">{event.desc}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">📝 Event Schema Example</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`{
  "id": "evt_1234567890",
  "type": "user.login",
  "version": "1.0",
  "timestamp": "2024-01-15T10:30:00Z",
  "source": "identity-service",
  "data": {
    "userId": "usr_abc123",
    "email": "user@example.com",
    "role": "CUSTOMER",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  },
  "metadata": {
    "correlationId": "corr_xyz789",
    "idempotencyKey": "idem_456"
  }
}`}
          </pre>
        </div>
      </Card>
    </section>
  );
}

// ==================== Main Page ====================
export function IdentityPhase2() {
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
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white">فاز ۲: Identity Context</h1>
              <p className="text-emerald-300 text-lg">Authentication, Authorization & User Management</p>
            </div>
          </div>

          <p className="text-gray-300 max-w-3xl leading-relaxed text-lg mb-6">
            پیاده‌سازی کامل Identity Context شامل احراز هویت، مجوزدهی، مدیریت کاربران،
            MFA، Session Management و Audit Logging با انطباق کامل با ABRAN SYSTEM Architecture v3.0.
          </p>

          <div className="flex gap-3 flex-wrap">
            {['Zero Trust', 'Three-Level RBAC', 'MFA (TOTP)', 'JWT Auth', 'Audit Logging', 'Event-Driven'].map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-medium border border-emerald-500/30">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sections */}
      <ValidationReport />
      <DatabaseSchemaSection />
      <PermissionMatrixSection />
      <AuthFlowSection />
      <APIEndpointsSection />
      <EventPublishingSection />
    </div>
  );
}
