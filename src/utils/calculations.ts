import { MembraneData, TestMetrics, HeaderConfig } from '../types';

export const metricDefs = [
  { key: 'inletPressure' as keyof TestMetrics, label: 'Inlet test pressure / แรงดันน้ำเข้า', unit: 'PSI' },
  { key: 'concentratePressure' as keyof TestMetrics, label: 'Concentrate test pressure / แรงดันน้ำทิ้ง', unit: 'PSI' },
  { key: 'inletFlow' as keyof TestMetrics, label: 'Inlet flow rate / อัตราไหลน้ำเข้า', unit: 'L/min' },
  { key: 'concentrateFlow' as keyof TestMetrics, label: 'Concentrate flow rate / อัตราไหลน้ำทิ้ง', unit: 'L/min' },
  { key: 'recovery' as keyof TestMetrics, label: 'Recovery / % น้ำดีที่ได้', unit: '%', goal: 'higher' },
  { key: 'permeateConductivity' as keyof TestMetrics, label: 'Permeate conductivity / ค่าการนำไฟฟ้าพรีเมต', unit: 'µS/cm', goal: 'lower' },
  { key: 'rawWaterConductivity' as keyof TestMetrics, label: 'Raw water conductivity / ค่าการนำไฟฟ้าน้ำดิบ', unit: 'µS/cm' },
  { key: 'rejection' as keyof TestMetrics, label: 'Salt rejection / % การขจัดเกลือ', unit: '%', goal: 'higher' }
];

export function formatNumber(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(Number(val))) return '-';
  return Number(val).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function formatPercent(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(Number(val))) return '-';
  return `${formatNumber(val)}%`;
}

export function valueText(val: number | null | undefined, unit: string): string {
  return unit === '%' ? formatPercent(val) : formatNumber(val);
}

export function deltaText(before: number | null | undefined, after: number | null | undefined, unit: string): string {
  if (before === null || before === undefined || after === null || after === undefined || isNaN(Number(before)) || isNaN(Number(after))) return '-';
  const delta = Number(after) - Number(before);
  const sign = delta > 0 ? '+' : '';
  return `${sign}${formatNumber(delta)}${unit === '%' ? ' pp' : ` ${unit}`}`;
}

export function getInterpretation(goal: string | undefined, before: number | null | undefined, after: number | null | undefined) {
  if (before === null || before === undefined || after === null || after === undefined || isNaN(Number(before)) || isNaN(Number(after))) {
    return { label: 'No data', css: 'neutral', isGood: false };
  }
  const delta = Number(after) - Number(before);
  if (!goal || delta === 0) {
    return { label: delta === 0 ? 'No change' : 'Reference value', css: 'neutral', isGood: false };
  }
  const isGood = goal === 'higher' ? delta > 0 : delta < 0;
  return {
    label: isGood ? 'Improved / ดีขึ้น' : 'Watch / ติดตาม',
    css: isGood ? 'good' : 'watch',
    isGood
  };
}

export function calculateRecovery(inletFlow?: number | null, concentrateFlow?: number | null): number | null {
  if (!inletFlow || !concentrateFlow || inletFlow <= 0 || concentrateFlow < 0) return null;
  const permeateFlow = inletFlow - concentrateFlow;
  return Number(((permeateFlow / inletFlow) * 100).toFixed(2));
}

export function calculateRejection(permeateConductivity?: number | null, rawWaterConductivity?: number | null): number | null {
  if (!permeateConductivity || !rawWaterConductivity || rawWaterConductivity <= 0) return null;
  const rej = (1 - permeateConductivity / rawWaterConductivity) * 100;
  return Number(rej.toFixed(2));
}

export const defaultHeaderConfig: HeaderConfig = {
  companyName: 'Lion Corporation (Thailand) Limited',
  reportTitle: 'RO4 Pass1 Membrane Cleaning Report',
  reportSubtitle: 'Service Report',
  jobDescription: 'Cleaning Membrane RO4 Pass1',
  servicePeriod: '10-16 June 2026'
};

export function getMembraneHeader(membrane?: MembraneData, fallbackConfig?: HeaderConfig): HeaderConfig {
  const fb = fallbackConfig || defaultHeaderConfig;
  if (!membrane?.headerConfig) return fb;
  return {
    companyName: membrane.headerConfig.companyName || fb.companyName,
    reportTitle: membrane.headerConfig.reportTitle || fb.reportTitle,
    reportSubtitle: membrane.headerConfig.reportSubtitle || fb.reportSubtitle,
    jobDescription: membrane.headerConfig.jobDescription || fb.jobDescription,
    servicePeriod: membrane.headerConfig.servicePeriod || fb.servicePeriod,
  };
}

export function exportHtmlFile(membranes: MembraneData[], headerConfig?: HeaderConfig) {
  const companyName = headerConfig?.companyName || 'Lion Corporation (Thailand) Limited';
  const reportTitle = headerConfig?.reportTitle || 'RO4 Pass1 Membrane Cleaning Report';
  const jobDescription = headerConfig?.jobDescription || 'Cleaning Membrane RO4 Pass1';
  const servicePeriod = headerConfig?.servicePeriod || '10-16 June 2026';

  const jsonStr = JSON.stringify(membranes, null, 2);
  const htmlContent = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${companyName} | ${reportTitle}</title>
  <style>
    :root { --ink:#101d32; --navy:#0b1b35; --blue:#156dd1; --paper:#ffffff; --line:#dce6f1; --muted:#60728b; --pass:#078a55; --pass-bg:#e7f8ef; --remark:#b36308; --remark-bg:#fff1db; }
    * { box-sizing:border-box; } body { margin:0; min-height:100vh; background:#edf3f8; color:var(--ink); font-family:Inter,"Segoe UI",Tahoma,sans-serif; padding:20px; }
    .card { max-width:1100px; margin:0 auto; background:#fff; border-radius:16px; padding:24px; box-shadow:0 10px 30px rgba(0,0,0,0.08); }
    h1 { margin-top:0; color:var(--navy); font-size:24px; }
    .meta { font-size:13px; color:var(--muted); margin-bottom:20px; padding-bottom:15px; border-bottom:1px solid var(--line); }
    .badge { padding:4px 12px; border-radius:999px; font-weight:bold; font-size:12px; display:inline-block; }
    .badge.PASS { background:var(--pass-bg); color:var(--pass); }
    .badge.REMARK { background:var(--remark-bg); color:var(--remark); }
    table { width:100%; border-collapse:collapse; margin-top:16px; font-size:14px; }
    th, td { border:1px solid var(--line); padding:10px; text-align:left; }
    th { background:#f2f6fb; }
    .photo-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(120px, 1fr)); gap:10px; margin-top:10px; }
    .photo-grid img { width:100%; height:120px; object-fit:cover; border-radius:8px; border:1px solid var(--line); }
  </style>
</head>
<body>
  <div class="card">
    <h1>${companyName} - ${reportTitle}</h1>
    <div class="meta">
      <strong>Job:</strong> ${jobDescription} &middot; 
      <strong>Service Period:</strong> ${servicePeriod} &middot; 
      <strong>Total Records:</strong> ${membranes.length} pcs.
    </div>
    <div id="content"></div>
  </div>
  <script>
    const membranes = ${jsonStr};
    document.getElementById('content').innerHTML = membranes.map(m => \`
      <div style="margin-bottom:30px; border-bottom:2px solid #dce6f1; padding-bottom:20px;">
        <h2>Membrane No. \${m.membraneNo} <span class="badge \${m.status}">\${m.status}</span></h2>
        <p><strong>Serial:</strong> \${m.serialNumber || '-'} | <strong>Brand:</strong> \${m.brandModel || '-'} | <strong>Location:</strong> Vessel \${m.location?.vessel || '-'}, Position \${m.location?.position || '-'}</p>
        <p><strong>Note:</strong> \${m.note || '-'}</p>
        \${m.images?.before?.length ? '<div><strong>Before Cleaning Photos:</strong><div class="photo-grid">' + m.images.before.map(src => '<img src="' + src + '" />').join('') + '</div></div>' : ''}
        \${m.images?.after?.length ? '<div style="margin-top:10px;"><strong>After Cleaning Photos:</strong><div class="photo-grid">' + m.images.after.map(src => '<img src="' + src + '" />').join('') + '</div></div>' : ''}
      </div>
    \`).join('');
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `membrane-cleaning-report-${new Date().toISOString().slice(0, 10)}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
