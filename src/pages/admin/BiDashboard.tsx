import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { BI_CONFIG } from '../../bi';
import { 
  mrrSnapshotJob, 
  marginMatrixJob, 
  healthIndexService,
  funnelBuilder,
  cacLtvService,
  rfmJob,
  cohortRetentionJob,
  revenueForecastService,
  anomalyDetectionService,
} from '../../bi/compute';

export function BiDashboard() {
  const [activeTab, setActiveTab] = useState('command-center');
  const [mrrData, setMrrData] = useState<any[]>([]);
  const [marginData, setMarginData] = useState<any[]>([]);
  const [healthIndex, setHealthIndex] = useState<any>(null);
  const [funnelData, setFunnelData] = useState<any[]>([]);
  const [rfmData, setRfmData] = useState<any[]>([]);
  const [cohortData, setCohortData] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [anomalyData, setAnomalyData] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [mrr, margin, health, funnel, rfm, cohort, forecast, anomaly] = await Promise.all([
      mrrSnapshotJob.execute(),
      marginMatrixJob.execute(),
      healthIndexService.compute(),
      funnelBuilder.build(),
      rfmJob.execute(),
      cohortRetentionJob.execute(),
      revenueForecastService.forecast(),
      anomalyDetectionService.detect('conversion_rate'),
    ]);

    setMrrData(mrr);
    setMarginData(margin);
    setHealthIndex(health);
    setFunnelData(funnel);
    setRfmData(rfm);
    setCohortData(cohort);
    setForecastData(forecast);
    setAnomalyData(anomaly);
  };

  const tabs = [
    { id: 'command-center', label: 'فرماندهی KPI' },
    { id: 'financial', label: 'مالی' },
    { id: 'marketing', label: 'بازاریابی' },
    { id: 'customers', label: 'مشتریان' },
    { id: 'predictive', label: 'پیش‌بینی' },
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">هوش تجاری و تحلیل داده</h1>
          <p className="text-gray-400">داشبورد جامع BI با ۳۰ متد تحلیل در ۶ لایه</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-[#00D4FF] border-b-2 border-[#00D4FF]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'command-center' && <CommandCenter healthIndex={healthIndex} mrrData={mrrData} />}
        {activeTab === 'financial' && <FinancialDashboard mrrData={mrrData} marginData={marginData} />}
        {activeTab === 'marketing' && <MarketingDashboard funnelData={funnelData} />}
        {activeTab === 'customers' && <CustomerDashboard rfmData={rfmData} cohortData={cohortData} />}
        {activeTab === 'predictive' && <PredictiveDashboard forecastData={forecastData} anomalyData={anomalyData} />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// COMMAND CENTER (Spec #6)
// ═══════════════════════════════════════════════════════════

function CommandCenter({ healthIndex, mrrData }: any) {
  if (!healthIndex) return <div>Loading...</div>;

  const kpiCards = [
    { label: 'MRR', value: '۱۵۰M', change: '+۱۲٪', color: BI_CONFIG.palette.cyan },
    { label: 'Net Revenue', value: '۱۸۰M', change: '+۸٪', color: BI_CONFIG.palette.emerald },
    { label: 'Health Index', value: healthIndex.healthIndex.toFixed(1), change: '+۵٪', color: BI_CONFIG.palette.purple },
    { label: 'Active Customers', value: '۱,۲۵۰', change: '+۳٪', color: BI_CONFIG.palette.teal },
    { label: 'Churn Rate', value: '۴.۵٪', change: '-۰.۵٪', color: BI_CONFIG.palette.red },
    { label: 'Gross Margin', value: '۶۸٪', change: '+۲٪', color: BI_CONFIG.palette.lime },
  ];

  const gaugeOption = {
    series: [{
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 100,
      radius: '100%',
      pointer: {
        show: true,
        length: '60%',
        width: 6,
        itemStyle: { color: BI_CONFIG.palette.cyan },
      },
      axisLine: {
        lineStyle: {
          width: 20,
          color: [
            [0.3, BI_CONFIG.palette.red],
            [0.7, BI_CONFIG.palette.amber],
            [1, BI_CONFIG.palette.emerald],
          ],
        },
      },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: {
        valueAnimation: true,
        formatter: '{value}',
        color: '#fff',
        fontSize: 32,
        offsetCenter: [0, '20%'],
      },
      data: [{ value: healthIndex.healthIndex }],
    }],
  };

  const radarOption = {
    radar: {
      indicator: [
        { name: 'MRR Growth', max: 100 },
        { name: 'Margin', max: 100 },
        { name: 'Customer Health', max: 100 },
        { name: 'Retention', max: 100 },
        { name: 'Expansion', max: 100 },
      ],
      shape: 'circle',
      splitArea: { areaStyle: { color: ['rgba(0, 212, 255, 0.05)', 'rgba(0, 212, 255, 0.1)'] } },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
    },
    series: [{
      type: 'radar',
      data: [{
        value: [
          healthIndex.mrrGrowth,
          healthIndex.marginScore,
          healthIndex.avgCustomerHealth,
          75,
          68,
        ],
        name: 'KPI Balance',
        areaStyle: { color: 'rgba(0, 212, 255, 0.2)' },
        lineStyle: { color: BI_CONFIG.palette.cyan },
        itemStyle: { color: BI_CONFIG.palette.cyan },
      }],
    }],
  };

  return (
    <div>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {kpiCards.map((kpi, i) => (
          <div key={i} className="bg-[#0a0f1f] border border-white/10 rounded-xl p-4">
            <div className="text-gray-400 text-sm mb-2">{kpi.label}</div>
            <div className="text-2xl font-bold mb-1" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className={`text-sm ${kpi.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
              {kpi.change}
            </div>
          </div>
        ))}
      </div>

      {/* Gauge + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0a0f1f] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Health Index</h3>
          <ReactECharts option={gaugeOption} style={{ height: '300px' }} />
        </div>
        <div className="bg-[#0a0f1f] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">KPI Balance Radar</h3>
          <ReactECharts option={radarOption} style={{ height: '300px' }} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// FINANCIAL DASHBOARD (Spec #3-5)
// ═══════════════════════════════════════════════════════════

function FinancialDashboard({ mrrData, marginData }: any) {
  // MRR Waterfall Chart (Spec #4)
  const waterfallOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: {
      type: 'category',
      data: mrrData.map((d: any) => d.date),
      axisLabel: { color: '#999' },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#999', formatter: (v: number) => `${(v / 1000000).toFixed(0)}M` },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
    },
    series: [
      {
        name: 'New MRR',
        type: 'bar',
        stack: 'mrr',
        data: mrrData.map((d: any) => d.newMrr),
        itemStyle: { color: BI_CONFIG.palette.emerald },
      },
      {
        name: 'Expansion',
        type: 'bar',
        stack: 'mrr',
        data: mrrData.map((d: any) => d.expansionMrr),
        itemStyle: { color: BI_CONFIG.palette.lime },
      },
      {
        name: 'Churn',
        type: 'bar',
        stack: 'mrr',
        data: mrrData.map((d: any) => -d.churnMrr),
        itemStyle: { color: BI_CONFIG.palette.red },
      },
    ],
  };

  // Margin Heatmap (Spec #5)
  const heatmapOption = {
    tooltip: { position: 'top' },
    xAxis: {
      type: 'category',
      data: ['Datacenter', 'IP', 'Gateway', 'Support'],
      axisLabel: { color: '#999' },
    },
    yAxis: {
      type: 'category',
      data: marginData.map((d: any) => d.product),
      axisLabel: { color: '#999' },
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      inRange: { color: [BI_CONFIG.palette.emerald, BI_CONFIG.palette.amber, BI_CONFIG.palette.red] },
    },
    series: [{
      type: 'heatmap',
      data: marginData.flatMap((d: any, i: number) => [
        [0, i, (d.datacenterCost / d.mrr) * 100],
        [1, i, (d.ipCost / d.mrr) * 100],
        [2, i, (d.gatewayCost / d.mrr) * 100],
        [3, i, (d.supportCost / d.mrr) * 100],
      ]),
      label: { show: true, formatter: (p: any) => `${p.value[2].toFixed(1)}%` },
    }],
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0a0f1f] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">MRR Waterfall (Spec #4)</h3>
          <ReactECharts option={waterfallOption} style={{ height: '400px' }} />
        </div>
        <div className="bg-[#0a0f1f] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Margin Heatmap (Spec #5)</h3>
          <ReactECharts option={heatmapOption} style={{ height: '400px' }} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MARKETING DASHBOARD (Spec #7-14)
// ═══════════════════════════════════════════════════════════

function MarketingDashboard({ funnelData }: any) {
  // Funnel Chart (Spec #7)
  const funnelOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    series: [{
      type: 'funnel',
      left: '10%',
      top: 60,
      bottom: 60,
      width: '80%',
      min: 0,
      max: 10000,
      minSize: '0%',
      maxSize: '100%',
      sort: 'descending',
      gap: 2,
      label: {
        show: true,
        position: 'inside',
        formatter: (p: any) => `${p.name}\n${p.value}`,
        fontSize: 14,
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 1,
      },
      data: funnelData.map((d: any, i: number) => ({
        value: d.count,
        name: d.stage,
        itemStyle: { color: [
          BI_CONFIG.palette.cyan,
          BI_CONFIG.palette.azure,
          BI_CONFIG.palette.purple,
          BI_CONFIG.palette.pink,
          BI_CONFIG.palette.emerald,
        ][i] },
      })),
    }],
  };

  return (
    <div>
      <div className="bg-[#0a0f1f] border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">Sales Funnel (Spec #7)</h3>
        <ReactECharts option={funnelOption} style={{ height: '500px' }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CUSTOMER DASHBOARD (Spec #15-19)
// ═══════════════════════════════════════════════════════════

function CustomerDashboard({ rfmData, cohortData }: any) {
  // RFM Bubble Scatter (Spec #15)
  const scatterOption = {
    tooltip: {
      formatter: (p: any) => `Customer: ${p.data[3]}<br/>Recency: ${p.data[0]}d<br/>Frequency: ${p.data[1]}<br/>Monetary: ${(p.data[2] / 1000000).toFixed(1)}M`,
    },
    xAxis: {
      name: 'Recency (days)',
      axisLabel: { color: '#999' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
    },
    yAxis: {
      name: 'Frequency',
      axisLabel: { color: '#999' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
    },
    series: [{
      type: 'scatter',
      symbolSize: (data: any) => Math.sqrt(data[2]) / 1000,
      data: rfmData.map((d: any) => [d.recency, d.frequency, d.monetary, d.customerId]),
      itemStyle: {
        color: (params: any) => {
          const segment = rfmData[params.dataIndex]?.segment;
          const colors: Record<string, string> = {
            'Champions': BI_CONFIG.palette.emerald,
            'Loyal': BI_CONFIG.palette.cyan,
            'At Risk': BI_CONFIG.palette.amber,
            'Hibernating': BI_CONFIG.palette.slate,
          };
          return colors[segment] || BI_CONFIG.palette.slate;
        },
      },
    }],
  };

  // Cohort Retention Heatmap (Spec #18)
  const cohortMonths = [...new Set(cohortData.map((d: any) => d.cohortMonth))];
  const monthIndices = [...new Set(cohortData.map((d: any) => d.monthIndex))];

  const cohortOption = {
    tooltip: { position: 'top' },
    xAxis: {
      type: 'category',
      data: monthIndices.map(m => `M${m}`),
      axisLabel: { color: '#999' },
    },
    yAxis: {
      type: 'category',
      data: cohortMonths,
      axisLabel: { color: '#999' },
    },
    visualMap: {
      min: 30,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      inRange: { color: ['#1a3a6c', '#4FC3F7', '#00D4FF'] },
    },
    series: [{
      type: 'heatmap',
      data: cohortData.map((d: any) => [
        d.monthIndex,
        cohortMonths.indexOf(d.cohortMonth),
        d.retentionRate,
      ]),
      label: { show: true, formatter: (p: any) => `${p.value[2].toFixed(0)}%` },
    }],
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0a0f1f] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">RFM Segmentation (Spec #15)</h3>
          <ReactECharts option={scatterOption} style={{ height: '400px' }} />
        </div>
        <div className="bg-[#0a0f1f] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Cohort Retention Heatmap (Spec #18)</h3>
          <ReactECharts option={cohortOption} style={{ height: '400px' }} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PREDICTIVE DASHBOARD (Spec #20-24)
// ═══════════════════════════════════════════════════════════

function PredictiveDashboard({ forecastData, anomalyData }: any) {
  // Revenue Forecast with CI Band (Spec #20)
  const forecastOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Actual', 'Forecast', 'Upper Bound', 'Lower Bound'], textStyle: { color: '#999' } },
    xAxis: {
      type: 'category',
      data: forecastData.map((d: any) => d.date),
      axisLabel: { color: '#999' },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#999', formatter: (v: number) => `${(v / 1000000).toFixed(0)}M` },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
    },
    series: [
      {
        name: 'Actual',
        type: 'line',
        data: forecastData.map((d: any) => d.actual),
        itemStyle: { color: BI_CONFIG.palette.cyan },
        lineStyle: { width: 3 },
      },
      {
        name: 'Forecast',
        type: 'line',
        data: forecastData.map((d: any) => d.forecast),
        itemStyle: { color: BI_CONFIG.palette.purple },
        lineStyle: { width: 3, type: 'dashed' },
      },
      {
        name: 'Upper Bound',
        type: 'line',
        data: forecastData.map((d: any) => d.upper),
        lineStyle: { opacity: 0 },
        stack: 'confidence',
        symbol: 'none',
      },
      {
        name: 'Lower Bound',
        type: 'line',
        data: forecastData.map((d: any) => d.lower),
        lineStyle: { opacity: 0 },
        areaStyle: { color: 'rgba(157, 107, 255, 0.3)' },
        stack: 'confidence',
        symbol: 'none',
      },
    ],
  };

  // Anomaly Detection (Spec #22)
  const anomalyOption = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: anomalyData.map((d: any) => d.date),
      axisLabel: { color: '#999' },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#999' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
    },
    series: [
      {
        name: 'Value',
        type: 'line',
        data: anomalyData.map((d: any) => d.value),
        itemStyle: { color: BI_CONFIG.palette.cyan },
        lineStyle: { width: 2 },
      },
      {
        name: 'Anomalies',
        type: 'scatter',
        data: anomalyData.map((d: any) => d.isAnomaly ? d.value : null),
        itemStyle: { color: BI_CONFIG.palette.red },
        symbolSize: 12,
      },
    ],
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0a0f1f] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Revenue Forecast with CI Band (Spec #20)</h3>
          <ReactECharts option={forecastOption} style={{ height: '400px' }} />
        </div>
        <div className="bg-[#0a0f1f] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Anomaly Detection (Spec #22)</h3>
          <ReactECharts option={anomalyOption} style={{ height: '400px' }} />
        </div>
      </div>
    </div>
  );
}
