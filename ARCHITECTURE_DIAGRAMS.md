# 🏗️ Architecture Diagrams - Mermaid.js

## 1. Isolated Admin Plane vs Public Plane

```mermaid
graph TB
    subgraph "PUBLIC INTERNET"
        User((کاربر))
    end

    subgraph "CUSTOMER PLANE - Public Website"
        Landing[Landing Page]
        Services[Services]
        Pricing[Pricing]
        Contact[Contact]
    end

    subgraph "ADMIN / OPS PLANE - Isolated Network"
        subgraph "Private Access Gateway"
            IPAllow[IP Allowlist]
            MFA[MFA - TOTP]
            CertAuth[Device Certificate]
        end

        subgraph "Admin Portals"
            AdminPortal[Admin Portal<br/>Management]
            OpsPortal[Ops Portal<br/>Technical Controls]
            MonitorPortal[Monitoring Portal<br/>Real-time Metrics]
            Breakglass[Breakglass Access<br/>2-person approval]
        end

        subgraph "Internal Services"
            ResourceMgr[Resource Manager]
            MigrationEngine[Migration Engine]
            BillingService[Billing Service]
            AuditLogger[Audit Logger]
        end
    end

    subgraph "TRI-PARTITE INFRASTRUCTURE"
        subgraph "Group 1: INTERNAL"
            InternalDC1[Tehran DC1]
            InternalDC2[Tehran DC2]
        end

        subgraph "Group 2: LOCAL EXTERNAL"
            ParsOnline[Pars Online]
            AsiaTech[AsiaTech]
        end

        subgraph "Group 3: INTL EXTERNAL"
            Hetzner[Hetzner EU]
            DigitalOcean[DigitalOcean AMS]
            AWS[AWS Singapore]
        end
    end

    User --> Landing
    Landing --> Services
    Services --> Pricing
    Pricing --> Contact

    IPAllow --> MFA
    MFA --> CertAuth
    CertAuth --> AdminPortal
    CertAuth --> OpsPortal
    CertAuth --> MonitorPortal
    CertAuth --> Breakglass

    AdminPortal --> ResourceMgr
    OpsPortal --> MigrationEngine
    MonitorPortal --> ResourceMgr
    Breakglass --> ResourceMgr

    ResourceMgr --> InternalDC1
    ResourceMgr --> InternalDC2
    ResourceMgr --> ParsOnline
    ResourceMgr --> AsiaTech
    ResourceMgr --> Hetzner
    ResourceMgr --> DigitalOcean
    ResourceMgr --> AWS

    MigrationEngine --> InternalDC1
    MigrationEngine --> ParsOnline
    MigrationEngine --> Hetzner

    style AdminPortal fill:#1e40af,stroke:#3b82f6,color:#fff
    style OpsPortal fill:#1e40af,stroke:#3b82f6,color:#fff
    style MonitorPortal fill:#1e40af,stroke:#3b82f6,color:#fff
    style Breakglass fill:#dc2626,stroke:#ef4444,color:#fff
```

## 2. Tri-Partite Provider Infrastructure Model

```mermaid
graph LR
    subgraph "Resource Orchestration Layer"
        Orchestrator[Unified Resource Manager]
    end

    subgraph "Group 1: INTERNAL<br/>On-Premise Infrastructure"
        direction TB
        IntProvider1[Tehran DC1<br/>Rack A]
        IntProvider2[Tehran DC2<br/>Rack B]
        
        IntMetrics[Metrics:<br/>- Hardware depreciation<br/>- Power/cooling costs<br/>- Physical rack space<br/>- SMART data, IPMI]
        
        IntControl[Control:<br/>- Direct SSH<br/>- IPMI access<br/>- No API middleman]
    end

    subgraph "Group 2: LOCAL EXTERNAL<br/>Domestic Datacenters"
        direction TB
        LocalProvider1[Pars Online<br/>Tehran]
        LocalProvider2[AsiaTech<br/>Isfahan]
        
        LocalMetrics[Metrics:<br/>- Monthly rental fees<br/>- Contract renewal dates<br/>- Local network latency<br/>- Support ticket SLAs]
        
        LocalControl[Control:<br/>- Local Provider API<br/>- Dedicated portal<br/>- Monthly billing IRR]
    end

    subgraph "Group 3: INTL EXTERNAL<br/>Europe/Asia Cloud"
        direction TB
        IntlProvider1[Hetzner<br/>Frankfurt]
        IntlProvider2[DigitalOcean<br/>Amsterdam]
        IntlProvider3[AWS<br/>Singapore]
        
        IntlMetrics[Metrics:<br/>- Hourly/Monthly costs<br/>- Exchange rate fluctuations<br/>- Bandwidth limits<br/>- GDPR/Compliance]
        
        IntlControl[Control:<br/>- Cloud APIs<br/>- Terraform/Ansible<br/>- Multi-currency USD/EUR]
    end

    Orchestrator --> IntProvider1
    Orchestrator --> IntProvider2
    Orchestrator --> LocalProvider1
    Orchestrator --> LocalProvider2
    Orchestrator --> IntlProvider1
    Orchestrator --> IntlProvider2
    Orchestrator --> IntlProvider3

    IntProvider1 --> IntMetrics
    IntProvider1 --> IntControl
    
    LocalProvider1 --> LocalMetrics
    LocalProvider1 --> LocalControl
    
    IntlProvider1 --> IntlMetrics
    IntlProvider1 --> IntlControl

    style IntProvider1 fill:#059669,stroke:#10b981,color:#fff
    style IntProvider2 fill:#059669,stroke:#10b981,color:#fff
    style LocalProvider1 fill:#2563eb,stroke:#3b82f6,color:#fff
    style LocalProvider2 fill:#2563eb,stroke:#3b82f6,color:#fff
    style IntlProvider1 fill:#7c3aed,stroke:#8b5cf6,color:#fff
    style IntlProvider2 fill:#7c3aed,stroke:#8b5cf6,color:#fff
    style IntlProvider3 fill:#7c3aed,stroke:#8b5cf6,color:#fff
```

## 3. Migration Engine Workflow

```mermaid
sequenceDiagram
    participant Admin as Admin User
    participant Wizard as Migration Wizard
    participant Engine as Migration Engine
    participant Source as Source Provider
    participant Target as Target Provider
    participant DNS as DNS Service

    Admin->>Wizard: Step 1: Select Source Resource
    Wizard->>Engine: Validate resource exists
    Engine-->>Wizard: Resource details
    
    Admin->>Wizard: Step 2: Select Target Provider
    Wizard->>Engine: Check compatibility
    Engine-->>Wizard: Compatible providers list
    
    Admin->>Wizard: Step 3: Pre-flight Check
    Wizard->>Engine: Calculate cost estimate
    Wizard->>Engine: Estimate downtime
    Wizard->>Engine: Verify compatibility
    Engine-->>Wizard: Pre-flight report
    
    Admin->>Wizard: Step 4: Execute Migration
    Wizard->>Engine: Start migration
    
    Engine->>Source: Create snapshot
    Source-->>Engine: Snapshot created
    
    Engine->>Target: Provision new instance
    Target-->>Engine: Instance ready
    
    Engine->>Target: Restore from snapshot
    Target-->>Engine: Restore complete
    
    Engine->>DNS: Update DNS records
    DNS-->>Engine: DNS propagated
    
    Engine->>Source: Decommission old instance
    Source-->>Engine: Instance removed
    
    Engine-->>Wizard: Migration complete
    Wizard-->>Admin: Success notification
```

## 4. Auto-Balancing Rules Engine

```mermaid
graph TD
    subgraph "Monitoring Layer"
        CPUMetric[CPU Usage]
        LatencyMetric[Network Latency]
        ExchangeRate[EUR/USD Rate]
    end

    subgraph "Rules Engine"
        Rule1{CPU > 85%<br/>for 10min?}
        Rule2{EUR/USD > 1.10<br/>for 1h?}
        Rule3{Latency > 50ms<br/>for 5min?}
    end

    subgraph "Actions"
        Action1[Route new orders<br/>to Local DC]
        Action2[Migrate workloads<br/>from Europe to Internal]
        Action3[Failover to<br/>International DC]
    end

    CPUMetric --> Rule1
    ExchangeRate --> Rule2
    LatencyMetric --> Rule3

    Rule1 -->|Yes| Action1
    Rule2 -->|Yes| Action2
    Rule3 -->|Yes| Action3

    Rule1 -->|No| Monitor1[Continue monitoring]
    Rule2 -->|No| Monitor2[Continue monitoring]
    Rule3 -->|No| Monitor3[Continue monitoring]

    style Rule1 fill:#f59e0b,stroke:#fbbf24,color:#000
    style Rule2 fill:#f59e0b,stroke:#fbbf24,color:#000
    style Rule3 fill:#f59e0b,stroke:#fbbf24,color:#000
    style Action1 fill:#10b981,stroke:#34d399,color:#fff
    style Action2 fill:#10b981,stroke:#34d399,color:#fff
    style Action3 fill:#10b981,stroke:#34d399,color:#fff
```

## 5. Multi-Currency Financial Flow

```mermaid
graph LR
    subgraph "Wholesale Costs"
        IntCost[Internal Cost<br/>IRR 0<br/>Ownership]
        LocalCost[Local DC Cost<br/>IRR 45,000/hr]
        IntlCost[Intl DC Cost<br/>USD 0.045/hr<br/>EUR 0.089/hr]
    end

    subgraph "Exchange Rates"
        USDIRR[USD/IRR<br/>1 USD = 50,000 IRR]
        EURIRR[EUR/IRR<br/>1 EUR = 55,000 IRR]
    end

    subgraph "Retail Prices"
        IntRetail[Internal Retail<br/>IRR 2,500,000<br/>Margin: 25%]
        LocalRetail[Local Retail<br/>IRR 1,200,000<br/>Margin: 20%]
        IntlRetail[Intl Retail<br/>IRR 1,800,000<br/>Margin: 40%]
    end

    subgraph "Profit Calculation"
        Profit[Monthly Profit<br/>IRR 1,700,000,000]
    end

    IntCost --> IntRetail
    LocalCost --> USDIRR
    IntlCost --> EURIRR
    
    USDIRR --> LocalRetail
    EURIRR --> IntlRetail

    IntRetail --> Profit
    LocalRetail --> Profit
    IntlRetail --> Profit

    style IntCost fill:#059669,stroke:#10b981,color:#fff
    style LocalCost fill:#2563eb,stroke:#3b82f6,color:#fff
    style IntlCost fill:#7c3aed,stroke:#8b5cf6,color:#fff
    style Profit fill:#f59e0b,stroke:#fbbf24,color:#000
```

## 6. Zero Trust Access Control

```mermaid
graph TD
    subgraph "Access Request"
        User[Admin User]
        Device[Device]
        IP[IP Address]
    end

    subgraph "Authentication Layer"
        IPCheck{IP in<br/>Allowlist?}
        MFAChallenge[MFA Challenge<br/>TOTP Code]
        CertCheck{Device<br/>Certificate<br/>Valid?}
    end

    subgraph "Authorization Layer"
        RBACCheck{RBAC<br/>Permission<br/>Check}
        L1[L1 Super Admin<br/>Full Access]
        L2[L2 Ops Admin<br/>Read + Write]
        L3[L3 Viewer<br/>Read Only]
    end

    subgraph "Audit Layer"
        AuditLog[Audit Log<br/>Immutable Record]
    end

    User --> IPCheck
    Device --> CertCheck
    IP --> IPCheck

    IPCheck -->|Yes| MFAChallenge
    IPCheck -->|No| Deny1[Access Denied]

    MFAChallenge -->|Valid| CertCheck
    MFAChallenge -->|Invalid| Deny2[Access Denied]

    CertCheck -->|Valid| RBACCheck
    CertCheck -->|Invalid| Deny3[Access Denied]

    RBACCheck --> L1
    RBACCheck --> L2
    RBACCheck --> L3

    L1 --> AuditLog
    L2 --> AuditLog
    L3 --> AuditLog

    style IPCheck fill:#f59e0b,stroke:#fbbf24,color:#000
    style MFAChallenge fill:#f59e0b,stroke:#fbbf24,color:#000
    style CertCheck fill:#f59e0b,stroke:#fbbf24,color:#000
    style RBACCheck fill:#f59e0b,stroke:#fbbf24,color:#000
    style L1 fill:#dc2626,stroke:#ef4444,color:#fff
    style L2 fill:#2563eb,stroke:#3b82f6,color:#fff
    style L3 fill:#059669,stroke:#10b981,color:#fff
```

---

**تمامی نمودارها با Mermaid.js قابل رندر هستند و معماری کامل سیستم را نشان می‌دهند.**
