// ═══════════════════════════════════════════════════════════
// MULTI-REGION INFRASTRUCTURE & DEPLOYMENT ARCHITECTURE
// Geo-Distributed Control Plane
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// MODULE 1: REGION CONFIGURATION & TOPOLOGY MODEL
// ═══════════════════════════════════════════════════════════

export type RegionCode = 'IR' | 'EU' | 'US' | 'ASIA';
export type RegionStatus = 'ACTIVE' | 'DEGRADED' | 'OFFLINE' | 'PLANNED';
export type DataResidencyPolicy = 'STRICT_LOCAL' | 'GDPR' | 'CONFIGURABLE';
export type SanctionsRisk = 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
export type K8sProvider = 'RKE2' | 'EKS' | 'GKE' | 'BARE_METAL';
export type VirtualizationType = 'KubeVirt' | 'VMware' | 'KVM' | 'None';

export interface RegionCompliance {
  dataResidency: DataResidencyPolicy;
  sanctionsRisk: SanctionsRisk;
  crossBorderAllowed: boolean;
  gdprCompliant: boolean;
}

export interface RegionInfrastructure {
  k8sProvider: K8sProvider;
  virtualization: VirtualizationType[];
  storageClass: string[];
  networkProvider: string;
}

export interface RegionEndpoints {
  apiGateway: string;
  metricsExporter: string;
  backupTarget: string;
}

export interface RegionCapacity {
  maxVps: number;
  maxGpu: number;
  currentUtilization: number; // 0.0 - 1.0
}

export interface RegionConfig {
  id: string;
  code: RegionCode;
  name: string;
  flag: string;
  status: RegionStatus;
  compliance: RegionCompliance;
  infrastructure: RegionInfrastructure;
  endpoints: RegionEndpoints;
  capacity: RegionCapacity;
}

// Initial Region Configuration (DC-A: Iran, DC-B: Europe, DC-C: Future)
export const INITIAL_REGIONS: RegionConfig[] = [
  {
    id: 'dc-a-iran',
    code: 'IR',
    name: 'Iran Datacenter (DC-A)',
    flag: '🇮🇷',
    status: 'ACTIVE',
    compliance: {
      dataResidency: 'STRICT_LOCAL',
      sanctionsRisk: 'HIGH',
      crossBorderAllowed: false,
      gdprCompliant: false,
    },
    infrastructure: {
      k8sProvider: 'RKE2',
      virtualization: ['KubeVirt', 'KVM'],
      storageClass: ['local-ssd', 'ceph-block'],
      networkProvider: 'calico',
    },
    endpoints: {
      apiGateway: 'https://api.ir.abran.system',
      metricsExporter: 'http://metrics.ir.abran.system:9090',
      backupTarget: 's3://backup-ir.abran.system',
    },
    capacity: {
      maxVps: 500,
      maxGpu: 50,
      currentUtilization: 0.65,
    },
  },
  {
    id: 'dc-b-europe',
    code: 'EU',
    name: 'Europe Datacenter (DC-B)',
    flag: '🇪🇺',
    status: 'ACTIVE',
    compliance: {
      dataResidency: 'GDPR',
      sanctionsRisk: 'LOW',
      crossBorderAllowed: true,
      gdprCompliant: true,
    },
    infrastructure: {
      k8sProvider: 'RKE2',
      virtualization: ['KubeVirt', 'VMware'],
      storageClass: ['ebs-gp3', 'ceph-block', 'ceph-filesystem'],
      networkProvider: 'cilium',
    },
    endpoints: {
      apiGateway: 'https://api.eu.abran.system',
      metricsExporter: 'http://metrics.eu.abran.system:9090',
      backupTarget: 's3://backup-eu.abran.system',
    },
    capacity: {
      maxVps: 1000,
      maxGpu: 200,
      currentUtilization: 0.45,
    },
  },
  {
    id: 'dc-c-future',
    code: 'ASIA',
    name: 'Asia Datacenter (DC-C) - Planned',
    flag: '🌏',
    status: 'PLANNED',
    compliance: {
      dataResidency: 'CONFIGURABLE',
      sanctionsRisk: 'MEDIUM',
      crossBorderAllowed: true,
      gdprCompliant: false,
    },
    infrastructure: {
      k8sProvider: 'EKS',
      virtualization: ['KubeVirt'],
      storageClass: ['ebs-gp3'],
      networkProvider: 'cilium',
    },
    endpoints: {
      apiGateway: 'https://api.asia.abran.system',
      metricsExporter: 'http://metrics.asia.abran.system:9090',
      backupTarget: 's3://backup-asia.abran.system',
    },
    capacity: {
      maxVps: 800,
      maxGpu: 150,
      currentUtilization: 0,
    },
  },
];

// Region Registry - Loads, validates, caches regions
export class RegionRegistry {
  private regions: Map<string, RegionConfig> = new Map();
  private static instance: RegionRegistry;

  private constructor() {
    this.loadRegions(INITIAL_REGIONS);
  }

  static getInstance(): RegionRegistry {
    if (!RegionRegistry.instance) {
      RegionRegistry.instance = new RegionRegistry();
    }
    return RegionRegistry.instance;
  }

  private loadRegions(configs: RegionConfig[]): void {
    for (const config of configs) {
      this.validateRegion(config);
      this.regions.set(config.code, config);
    }
    console.log(`[RegionRegistry] Loaded ${configs.length} regions`);
  }

  private validateRegion(config: RegionConfig): void {
    if (!config.id || !config.code || !config.name) {
      throw new Error(`Invalid region config: missing required fields`);
    }
    if (config.capacity.currentUtilization < 0 || config.capacity.currentUtilization > 1) {
      throw new Error(`Invalid utilization for region ${config.code}`);
    }
  }

  getRegion(code: RegionCode): RegionConfig | undefined {
    return this.regions.get(code);
  }

  getAllRegions(): RegionConfig[] {
    return Array.from(this.regions.values());
  }

  getActiveRegions(): RegionConfig[] {
    return this.getAllRegions().filter(r => r.status === 'ACTIVE');
  }

  updateRegionStatus(code: RegionCode, status: RegionStatus): void {
    const region = this.regions.get(code);
    if (region) {
      region.status = status;
      console.log(`[RegionRegistry] Region ${code} status changed to ${status}`);
    }
  }

  updateUtilization(code: RegionCode, utilization: number): void {
    const region = this.regions.get(code);
    if (region) {
      region.capacity.currentUtilization = Math.max(0, Math.min(1, utilization));
    }
  }
}

export const regionRegistry = RegionRegistry.getInstance();

// ═══════════════════════════════════════════════════════════
// MODULE 2: TRAFFIC STEERING & ROUTING ENGINE
// ═══════════════════════════════════════════════════════════

export interface SteeringContext {
  tenantId: string;
  tenantRegion: RegionCode;
  requestedService: 'VPS' | 'GPU' | 'STORAGE';
  latencyPreferences?: RegionCode[];
  costWeight: number; // 0.0 (cheapest) to 1.0 (fastest)
  complianceOverrides?: { allowCrossBorder: boolean };
}

export interface SteeringDecision {
  selectedRegion: RegionConfig;
  reason: string;
  fallbackRegions: RegionConfig[];
  estimatedLatencyMs: number;
  estimatedCostMultiplier: number;
}

export class TrafficSteeringEngine {
  private latencyData: Map<string, number> = new Map(); // key: "{from}-{to}", value: ms

  constructor() {
    // Initialize with default latency estimates
    this.latencyData.set('IR-IR', 5);
    this.latencyData.set('IR-EU', 120);
    this.latencyData.set('EU-EU', 10);
    this.latencyData.set('EU-IR', 120);
    this.latencyData.set('IR-ASIA', 80);
    this.latencyData.set('EU-ASIA', 150);
  }

  async decide(context: SteeringContext): Promise<SteeringDecision> {
    const activeRegions = regionRegistry.getActiveRegions();

    // Step 1: Filter by Compliance
    const compliantRegions = this.filterByCompliance(activeRegions, context);

    // Step 2: Filter by Sanctions
    const sanctionedRegions = this.filterBySanctions(compliantRegions, context);

    // Step 3: Filter by Capacity
    const availableRegions = this.filterByCapacity(sanctionedRegions);

    if (availableRegions.length === 0) {
      throw new Error('No available regions matching compliance and capacity requirements');
    }

    // Step 4: Score remaining regions
    const scored = availableRegions.map(region => ({
      region,
      score: this.calculateScore(region, context),
      latency: this.getLatency(context.tenantRegion, region.code),
    }));

    // Step 5: Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    const selected = scored[0];
    const fallbacks = scored.slice(1, 4).map(s => s.region);

    return {
      selectedRegion: selected.region,
      reason: `Score: ${selected.score.toFixed(2)} | Latency: ${selected.latency}ms | Utilization: ${(selected.region.capacity.currentUtilization * 100).toFixed(0)}%`,
      fallbackRegions: fallbacks,
      estimatedLatencyMs: selected.latency,
      estimatedCostMultiplier: this.getCostMultiplier(selected.region),
    };
  }

  private filterByCompliance(regions: RegionConfig[], context: SteeringContext): RegionConfig[] {
    return regions.filter(region => {
      // Iran tenants must use IR unless cross-border approved
      if (context.tenantRegion === 'IR' && region.code !== 'IR' && !context.complianceOverrides?.allowCrossBorder) {
        return false;
      }

      // EU tenants must use GDPR-compliant regions
      if (context.tenantRegion === 'EU' && !region.compliance.gdprCompliant) {
        return false;
      }

      return true;
    });
  }

  private filterBySanctions(regions: RegionConfig[], context: SteeringContext): RegionConfig[] {
    // For demo, assume medium sanctions risk - can be extended to check tenant profile
    return regions.filter(region => {
      // If tenant has HIGH sanctions risk, only allow same-region or LOW risk regions
      if (context.tenantRegion === 'IR' && region.compliance.sanctionsRisk === 'HIGH') {
        return context.tenantRegion === region.code; // Same region only
      }
      return true;
    });
  }

  private filterByCapacity(regions: RegionConfig[]): RegionConfig[] {
    return regions.filter(r => r.capacity.currentUtilization < 0.90);
  }

  private calculateScore(region: RegionConfig, context: SteeringContext): number {
    const latencyScore = 1 / (this.getLatency(context.tenantRegion, region.code) / 10);
    const costScore = 1 / this.getCostMultiplier(region);
    const capacityScore = 1 - region.capacity.currentUtilization;

    const latencyWeight = context.costWeight;
    const costWeight = 1 - context.costWeight;
    const capacityWeight = 0.3;

    return (latencyWeight * latencyScore) + (costWeight * costScore) + (capacityWeight * capacityScore);
  }

  private getLatency(from: RegionCode, to: RegionCode): number {
    const key = `${from}-${to}`;
    return this.latencyData.get(key) || 200;
  }

  private getCostMultiplier(region: RegionConfig): number {
    const costs: Record<RegionCode, number> = {
      'IR': 0.6,
      'EU': 1.2,
      'US': 1.0,
      'ASIA': 0.8,
    };
    return costs[region.code] || 1.0;
  }

  updateLatency(from: RegionCode, to: RegionCode, latencyMs: number): void {
    this.latencyData.set(`${from}-${to}`, latencyMs);
  }
}

export const trafficSteeringEngine = new TrafficSteeringEngine();

// ═══════════════════════════════════════════════════════════
// MODULE 3: GEO-REDUNDANCY & FAILOVER STATE MACHINE
// ═══════════════════════════════════════════════════════════

export type HealthState = 'HEALTHY' | 'DEGRADED' | 'OFFLINE';

export interface RegionHealthStatus {
  regionCode: RegionCode;
  state: HealthState;
  consecutiveFailures: number;
  lastCheck: Date;
  lastHealthy: Date;
}

export class RegionHealthMonitor {
  private statuses: Map<RegionCode, RegionHealthStatus> = new Map();
  private readonly DEGRADED_THRESHOLD = 3;
  private readonly OFFLINE_THRESHOLD = 5;

  constructor() {
    // Initialize all regions as HEALTHY
    for (const region of regionRegistry.getAllRegions()) {
      this.statuses.set(region.code, {
        regionCode: region.code,
        state: 'HEALTHY',
        consecutiveFailures: 0,
        lastCheck: new Date(),
        lastHealthy: new Date(),
      });
    }
  }

  recordHealthCheck(regionCode: RegionCode, healthy: boolean): HealthState {
    const status = this.statuses.get(regionCode);
    if (!status) return 'OFFLINE';

    status.lastCheck = new Date();

    if (healthy) {
      status.consecutiveFailures = 0;
      status.lastHealthy = new Date();
      if (status.state !== 'HEALTHY') {
        status.state = 'HEALTHY';
        console.log(`[HealthMonitor] Region ${regionCode} recovered to HEALTHY`);
      }
    } else {
      status.consecutiveFailures++;

      if (status.consecutiveFailures >= this.OFFLINE_THRESHOLD) {
        if (status.state !== 'OFFLINE') {
          status.state = 'OFFLINE';
          console.log(`[HealthMonitor] Region ${regionCode} is OFFLINE (${status.consecutiveFailures} failures)`);
          regionRegistry.updateRegionStatus(regionCode, 'OFFLINE');
        }
      } else if (status.consecutiveFailures >= this.DEGRADED_THRESHOLD) {
        if (status.state !== 'DEGRADED') {
          status.state = 'DEGRADED';
          console.log(`[HealthMonitor] Region ${regionCode} is DEGRADED (${status.consecutiveFailures} failures)`);
          regionRegistry.updateRegionStatus(regionCode, 'DEGRADED');
        }
      }
    }

    return status.state;
  }

  getStatus(regionCode: RegionCode): RegionHealthStatus | undefined {
    return this.statuses.get(regionCode);
  }

  getAllStatuses(): RegionHealthStatus[] {
    return Array.from(this.statuses.values());
  }

  isHealthy(regionCode: RegionCode): boolean {
    return this.statuses.get(regionCode)?.state === 'HEALTHY';
  }
}

export const regionHealthMonitor = new RegionHealthMonitor();

// Failover State Machine
export class FailoverStateMachine {
  private currentState: Map<RegionCode, HealthState> = new Map();

  transition(regionCode: RegionCode, event: 'DEGRADE' | 'FAIL' | 'RECOVER'): HealthState {
    const current = this.currentState.get(regionCode) || 'HEALTHY';

    switch (current) {
      case 'HEALTHY':
        if (event === 'DEGRADE') {
          this.currentState.set(regionCode, 'DEGRADED');
          console.log(`[FailoverSM] ${regionCode}: HEALTHY → DEGRADED`);
          return 'DEGRADED';
        }
        if (event === 'FAIL') {
          this.currentState.set(regionCode, 'OFFLINE');
          console.log(`[FailoverSM] ${regionCode}: HEALTHY → OFFLINE`);
          this.triggerFailover(regionCode);
          return 'OFFLINE';
        }
        break;

      case 'DEGRADED':
        if (event === 'RECOVER') {
          this.currentState.set(regionCode, 'HEALTHY');
          console.log(`[FailoverSM] ${regionCode}: DEGRADED → HEALTHY`);
          return 'HEALTHY';
        }
        if (event === 'FAIL') {
          this.currentState.set(regionCode, 'OFFLINE');
          console.log(`[FailoverSM] ${regionCode}: DEGRADED → OFFLINE`);
          this.triggerFailover(regionCode);
          return 'OFFLINE';
        }
        break;

      case 'OFFLINE':
        if (event === 'RECOVER') {
          this.currentState.set(regionCode, 'DEGRADED');
          console.log(`[FailoverSM] ${regionCode}: OFFLINE → DEGRADED`);
          return 'DEGRADED';
        }
        break;
    }

    return current;
  }

  private triggerFailover(regionCode: RegionCode): void {
    console.log(`[FailoverSM] Triggering failover for region ${regionCode}`);
    // Step 1: Freeze provisioning
    regionRegistry.updateRegionStatus(regionCode, 'OFFLINE');
    // Step 2-6: Would be handled by AutoFailoverExecutor
  }

  getState(regionCode: RegionCode): HealthState {
    return this.currentState.get(regionCode) || 'HEALTHY';
  }
}

export const failoverStateMachine = new FailoverStateMachine();

// ═══════════════════════════════════════════════════════════
// MODULE 4: COMPLIANCE ENFORCEMENT HOOKS (Region-Specific)
// ═══════════════════════════════════════════════════════════

export class DataResidencyEnforcer {
  static enforce(tenantRegion: RegionCode, targetRegion: RegionConfig, crossBorderApproval?: boolean): void {
    // Rule 1: Iran tenants MUST use IR region unless explicit cross-border approval
    if (tenantRegion === 'IR' && targetRegion.code !== 'IR' && !crossBorderApproval) {
      throw new Error(`DATA_RESIDENCY_VIOLATION: Iranian data must reside in DC-A (Iran). Target: ${targetRegion.code}`);
    }

    // Rule 2: EU tenants MUST use GDPR-compliant regions
    if (tenantRegion === 'EU' && !targetRegion.compliance.gdprCompliant) {
      throw new Error(`GDPR_VIOLATION: EU data requires GDPR-compliant region. Target: ${targetRegion.code} (GDPR: ${targetRegion.compliance.gdprCompliant})`);
    }

    // Rule 3: Sanctions risk blocking
    if (tenantRegion === 'IR' && targetRegion.compliance.sanctionsRisk === 'HIGH') {
      if (tenantRegion !== targetRegion.code) {
        throw new Error(`SANCTIONS_VIOLATION: Cross-border transfer blocked for high-sanctions-risk tenant. Source: ${tenantRegion}, Target: ${targetRegion.code}`);
      }
    }
  }
}

export class CrossBorderTransferValidator {
  static validate(sourceRegion: RegionConfig, targetRegion: RegionConfig, adminOverride?: boolean): boolean {
    if (!sourceRegion.compliance.crossBorderAllowed && !adminOverride) {
      throw new Error(`CROSS_BORDER_VIOLATION: Source region ${sourceRegion.code} does not allow cross-border transfers`);
    }

    if (!targetRegion.compliance.crossBorderAllowed && !adminOverride) {
      throw new Error(`CROSS_BORDER_VIOLATION: Target region ${targetRegion.code} does not allow cross-border transfers`);
    }

    return true;
  }
}

// ═══════════════════════════════════════════════════════════
// MODULE 5: INFRASTRUCTURE ADAPTER ABSTRACTION (Per-Region)
// ═══════════════════════════════════════════════════════════

export interface ResourceSpecs {
  cpu: number;
  ram: number; // MB
  disk: number; // GB
  gpu?: string;
  os?: string;
}

export interface ResourceHandle {
  id: string;
  regionCode: RegionCode;
  externalId: string;
  status: string;
}

export interface ResourceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkIn: number;
  networkOut: number;
}

export interface IRegionAdapter {
  readonly regionCode: RegionCode;
  provision(specs: ResourceSpecs): Promise<ResourceHandle>;
  terminate(handle: ResourceHandle): Promise<void>;
  getStatus(handle: ResourceHandle): Promise<string>;
  reboot(handle: ResourceHandle): Promise<void>;
  getMetrics(handle: ResourceHandle): Promise<ResourceMetrics>;
}

// Iran DC Adapter
export class IranDCAdapter implements IRegionAdapter {
  readonly regionCode: RegionCode = 'IR';

  async provision(specs: ResourceSpecs): Promise<ResourceHandle> {
    console.log(`[IranDC] Provisioning VPS: ${specs.cpu}CPU, ${specs.ram}MB RAM, ${specs.disk}GB disk`);
    // RKE2 + KubeVirt provisioning logic
    return {
      id: `ir-${Date.now()}`,
      regionCode: 'IR',
      externalId: `kubevirt-vm-${Math.random().toString(36).slice(2)}`,
      status: 'PROVISIONING',
    };
  }

  async terminate(handle: ResourceHandle): Promise<void> {
    console.log(`[IranDC] Terminating ${handle.externalId}`);
  }

  async getStatus(handle: ResourceHandle): Promise<string> {
    return 'RUNNING';
  }

  async reboot(handle: ResourceHandle): Promise<void> {
    console.log(`[IranDC] Rebooting ${handle.externalId}`);
  }

  async getMetrics(handle: ResourceHandle): Promise<ResourceMetrics> {
    return { cpuUsage: 0.45, memoryUsage: 0.62, diskUsage: 0.38, networkIn: 1024, networkOut: 512 };
  }
}

// Europe DC Adapter
export class EuropeDCAdapter implements IRegionAdapter {
  readonly regionCode: RegionCode = 'EU';

  async provision(specs: ResourceSpecs): Promise<ResourceHandle> {
    console.log(`[EuropeDC] Provisioning VPS: ${specs.cpu}CPU, ${specs.ram}MB RAM, ${specs.disk}GB disk`);
    // RKE2 + KubeVirt/BareMetal + GDPR-aware handling
    return {
      id: `eu-${Date.now()}`,
      regionCode: 'EU',
      externalId: `kubevirt-vm-${Math.random().toString(36).slice(2)}`,
      status: 'PROVISIONING',
    };
  }

  async terminate(handle: ResourceHandle): Promise<void> {
    console.log(`[EuropeDC] Terminating ${handle.externalId}`);
  }

  async getStatus(handle: ResourceHandle): Promise<string> {
    return 'RUNNING';
  }

  async reboot(handle: ResourceHandle): Promise<void> {
    console.log(`[EuropeDC] Rebooting ${handle.externalId}`);
  }

  async getMetrics(handle: ResourceHandle): Promise<ResourceMetrics> {
    return { cpuUsage: 0.35, memoryUsage: 0.48, diskUsage: 0.25, networkIn: 2048, networkOut: 1024 };
  }
}

// Future DC Adapter (Stub)
export class FutureDCAdapter implements IRegionAdapter {
  readonly regionCode: RegionCode = 'ASIA';

  async provision(_specs: ResourceSpecs): Promise<ResourceHandle> {
    throw new Error('NOT_IMPLEMENTED: DC-C (Asia) is not yet operational');
  }

  async terminate(_handle: ResourceHandle): Promise<void> {
    throw new Error('NOT_IMPLEMENTED: DC-C (Asia) is not yet operational');
  }

  async getStatus(_handle: ResourceHandle): Promise<string> {
    throw new Error('NOT_IMPLEMENTED: DC-C (Asia) is not yet operational');
  }

  async reboot(_handle: ResourceHandle): Promise<void> {
    throw new Error('NOT_IMPLEMENTED: DC-C (Asia) is not yet operational');
  }

  async getMetrics(_handle: ResourceHandle): Promise<ResourceMetrics> {
    throw new Error('NOT_IMPLEMENTED: DC-C (Asia) is not yet operational');
  }
}

// Region Adapter Factory
export class RegionAdapterFactory {
  static getAdapter(region: RegionConfig): IRegionAdapter {
    switch (region.id) {
      case 'dc-a-iran':
        return new IranDCAdapter();
      case 'dc-b-europe':
        return new EuropeDCAdapter();
      case 'dc-c-future':
        return new FutureDCAdapter();
      default:
        throw new Error(`Unknown region: ${region.id}`);
    }
  }

  static getAdapterByCode(code: RegionCode): IRegionAdapter {
    const region = regionRegistry.getRegion(code);
    if (!region) throw new Error(`Region not found: ${code}`);
    return this.getAdapter(region);
  }
}

// ═══════════════════════════════════════════════════════════
// MODULE 6: MULTI-REGION OBSERVABILITY
// ═══════════════════════════════════════════════════════════

export interface GeoMetricLabels {
  region: RegionCode;
  datacenter: string;
  complianceZone: string;
}

export class GeoObservability {
  static getLabels(region: RegionConfig): GeoMetricLabels {
    return {
      region: region.code,
      datacenter: region.id,
      complianceZone: region.compliance.dataResidency,
    };
  }

  static async queryLatencyMatrix(): Promise<Record<string, Record<string, number>>> {
    const regions = regionRegistry.getAllRegions();
    const matrix: Record<string, Record<string, number>> = {};

    for (const from of regions) {
      matrix[from.code] = {};
      for (const to of regions) {
        matrix[from.code][to.code] = trafficSteeringEngine['getLatency'](from.code, to.code);
      }
    }

    return matrix;
  }
}

// ═══════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════

export const geoInfrastructure = {
  regionRegistry,
  trafficSteeringEngine,
  regionHealthMonitor,
  failoverStateMachine,
  DataResidencyEnforcer,
  CrossBorderTransferValidator,
  RegionAdapterFactory,
  GeoObservability,
};
