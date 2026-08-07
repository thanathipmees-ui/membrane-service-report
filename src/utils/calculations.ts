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

export function exportHtmlFile(membranes: MembraneData[], headerConfig?: HeaderConfig, customFilename?: string) {
  const companyName = headerConfig?.companyName || defaultHeaderConfig.companyName;
  const reportTitle = headerConfig?.reportTitle || defaultHeaderConfig.reportTitle;
  const reportSubtitle = headerConfig?.reportSubtitle || defaultHeaderConfig.reportSubtitle;
  const jobDescription = headerConfig?.jobDescription || defaultHeaderConfig.jobDescription;
  const servicePeriod = headerConfig?.servicePeriod || defaultHeaderConfig.servicePeriod;

  const passCount = membranes.filter(m => m.status === 'PASS').length;
  const remarkCount = membranes.filter(m => m.status === 'REMARK').length;

  // Build Summary Rows
  const summaryRowsHtml = membranes.map(m => {
    const isRemark = m.status === 'REMARK';
    const locStr = m.location ? `Vessel ${m.location.vessel} / Pos ${m.location.position}` : '-';
    return `
      <tr class="${isRemark ? 'summary-row-remark' : 'summary-row-pass'}">
        <td style="text-align: center; font-weight: 700;">No. ${m.membraneNo}</td>
        <td style="font-family: monospace; font-weight: 600;">${m.serialNumber || '-'}</td>
        <td>${m.brandModel || '-'}</td>
        <td>${locStr}</td>
        <td style="text-align: center;">
          <span class="status-badge ${isRemark ? 'remark' : 'pass'}">
            ${isRemark ? '⚠️ REMARK' : '✓ PASS'}
          </span>
        </td>
        <td style="${isRemark ? 'color: #c2410c; font-weight: 600;' : ''}">${m.note || '-'}</td>
      </tr>
    `;
  }).join('');

  // Build Detailed Membrane Cards
  const membraneCardsHtml = membranes.map(m => {
    const isRemark = m.status === 'REMARK';
    const cycles = m.cycles || [];
    const latestCycle = cycles.length > 0 ? cycles[cycles.length - 1] : { date: '', before: {}, after: {} };
    const before = latestCycle.before || {};
    const after = latestCycle.after || {};

    // Build metric rows
    const metricRows = metricDefs.map(def => {
      let valBefore = before[def.key];
      let valAfter = after[def.key];

      if (def.key === 'recovery') {
        if (valBefore == null) valBefore = calculateRecovery(before.inletFlow, before.concentrateFlow);
        if (valAfter == null) valAfter = calculateRecovery(after.inletFlow, after.concentrateFlow);
      } else if (def.key === 'rejection') {
        if (valBefore == null) valBefore = calculateRejection(before.permeateConductivity, before.rawWaterConductivity);
        if (valAfter == null) valAfter = calculateRejection(after.permeateConductivity, after.rawWaterConductivity);
      }

      const bStr = valueText(valBefore, def.unit);
      const aStr = valueText(valAfter, def.unit);
      const dStr = deltaText(valBefore, valAfter, def.unit);
      const interp = getInterpretation(def.goal, valBefore, valAfter);

      const isProblem = interp.css === 'watch' || (def.key === 'rejection' && valAfter !== null && valAfter < 95);

      let rowBg = '';
      let badgeHtml = '';

      if (isProblem) {
        rowBg = 'style="background-color: #fef2f2;"';
        badgeHtml = `<span class="badge badge-watch">⚠️ Watch / ติดตาม</span>`;
      } else if (interp.css === 'good') {
        rowBg = 'style="background-color: #f0fdf4;"';
        badgeHtml = `<span class="badge badge-good">✓ Improved / ดีขึ้น</span>`;
      } else {
        badgeHtml = `<span class="badge badge-neutral">${interp.label}</span>`;
      }

      return `
        <tr ${rowBg}>
          <td style="font-weight: 600; color: #1e293b;">${def.label}</td>
          <td style="text-align: center; font-family: monospace; color: #475569;">${bStr}</td>
          <td style="text-align: center; font-family: monospace; font-weight: 700; color: #0f172a;">${aStr}</td>
          <td style="text-align: center; font-family: monospace; font-weight: 600;">${dStr}</td>
          <td style="text-align: center;">${badgeHtml}</td>
        </tr>
      `;
    }).join('');

    // Photo Gallery html
    const renderPhotoList = (images: string[] | undefined, type: 'before' | 'after') => {
      const validImages = (images || []).filter(src => src && src.trim().length > 0);
      if (validImages.length === 0) {
        return `<div style="padding: 12px; text-align: center; color: #94a3b8; font-size: 11px; border: 1px dashed rgba(255,255,255,0.15); border-radius: 8px;">ไม่มีรูปภาพ</div>`;
      }
      const isBefore = type === 'before';
      const borderColor = isBefore ? '#f59e0b' : '#10b981';
      return `
        <div class="photo-grid">
          ${validImages.map((src, idx) => `
            <div class="photo-item" style="border-color: ${borderColor};" onclick="showPhoto('${src.replace(/'/g, "\\'")}')">
              <img src="${src}" alt="${type} photo ${idx + 1}" loading="lazy" />
              <span class="photo-idx">${idx + 1}</span>
            </div>
          `).join('')}
        </div>
      `;
    };

    return `
      <div class="membrane-card ${isRemark ? 'is-remark' : ''}">
        <div class="card-header ${isRemark ? 'remark' : 'pass'}">
          <div>
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: ${isRemark ? '#b45309' : '#2563eb'}; display: block; margin-bottom: 2px;">Membrane Report Details</span>
            <h2>Membrane No. ${m.membraneNo}</h2>
          </div>
          <span class="status-badge ${isRemark ? 'remark' : 'pass'}">
            ${isRemark ? '⚠️ REMARK' : '✓ PASS'}
          </span>
        </div>

        <div class="card-body">
          <div class="meta-grid">
            <div class="meta-item">
              <span class="meta-label">Serial Number</span>
              <span class="meta-value" style="font-family: monospace;">${m.serialNumber || '-'}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Brand / Model</span>
              <span class="meta-value">${m.brandModel || '-'}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Installed Location</span>
              <span class="meta-value">${m.location ? `Vessel ${m.location.vessel} / Position ${m.location.position}` : 'Not listed'}</span>
            </div>
          </div>

          ${(m.note || isRemark) ? `
            <div class="remark-box">
              <span style="font-size: 18px; line-height: 1;">⚠️</span>
              <div>
                <strong style="color: ${isRemark ? '#9a3412' : '#1e3a8a'};">หมายเหตุ / Remark:</strong>
                <div style="margin-top: 2px;">${m.note || 'ต้องรับการตรวจสอบเพิ่มเติม'}</div>
              </div>
            </div>
          ` : ''}

          <div style="margin-top: 16px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <h3 style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 0;">📊 ตารางผลการทดสอบ (Test Parameters Comparison)</h3>
              <span style="font-size: 11px; font-weight: 700; color: #64748b;">วันที่ทดสอบ: ${latestCycle.date || 'N/A'}</span>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th style="width: 32%;">ตัวชี้วัด (Parameter)</th>
                  <th style="width: 17%; text-align: center;">ก่อนล้าง (Before)</th>
                  <th style="width: 17%; text-align: center;">หลังล้าง (After)</th>
                  <th style="width: 16%; text-align: center;">ส่วนต่าง (Delta)</th>
                  <th style="width: 18%; text-align: center;">ประเมินผล</th>
                </tr>
              </thead>
              <tbody>
                ${metricRows}
              </tbody>
            </table>
          </div>

          <div class="photo-section">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; margin-bottom: 12px;">
              <h3 style="font-size: 14px; font-weight: 800; color: white; margin: 0;">📷 Visual Condition (สภาพปรากฏ)</h3>
              <span style="font-size: 11px; color: #94a3b8;">คลิกรูปภาพเพื่อขยายดูความคมชัด</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
              <div>
                <span style="font-size: 11px; font-weight: 800; color: #fde047; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 6px;">Before Cleaning (ก่อนล้าง)</span>
                ${renderPhotoList(m.images?.before, 'before')}
              </div>

              <div>
                <span style="font-size: 11px; font-weight: 800; color: #6ee7b7; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 6px;">After Cleaning (หลังล้าง)</span>
                ${renderPhotoList(m.images?.after, 'after')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const htmlContent = `<!doctype html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${companyName} | ${reportTitle}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      background-color: #edf3f8;
      color: #1e293b;
      font-family: 'Prompt', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    /* Header Masthead Banner */
    .masthead {
      background: linear-gradient(135deg, #0b1b35 0%, #0f3970 50%, #156dd1 100%);
      color: white;
      padding: 28px 32px;
      border-radius: 20px;
      box-shadow: 0 20px 25px -5px rgba(11, 27, 53, 0.25);
      margin-bottom: 24px;
    }

    .masthead-title {
      font-size: 26px;
      font-weight: 800;
      margin: 6px 0 2px 0;
      letter-spacing: -0.02em;
    }

    .masthead-subtitle {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #67e8f9;
    }

    .masthead-meta {
      font-size: 14px;
      color: #cff4fc;
      margin-top: 4px;
    }

    .stats-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      margin-top: 20px;
    }

    .stat-pill {
      padding: 6px 16px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .stat-pill.pass {
      background: rgba(6, 78, 59, 0.5);
      border-color: rgba(52, 211, 153, 0.4);
      color: #a7f3d0;
    }

    .stat-pill.remark {
      background: rgba(124, 45, 18, 0.5);
      border-color: rgba(fb923c, 0.4);
      color: #fed7aa;
    }

    .btn-print {
      margin-left: auto;
      background: #0284c7;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .btn-print:hover {
      background: #0369a1;
      transform: translateY(-1px);
    }

    /* Section Cards */
    .section-card {
      background: white;
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
      margin-bottom: 24px;
    }

    .section-title {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 16px;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin: 12px 0;
      font-size: 13px;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #cbd5e1;
    }

    th {
      background-color: #0f172a;
      color: white;
      font-weight: 700;
      padding: 10px 14px;
      text-align: left;
      font-size: 12px;
    }

    td {
      padding: 10px 14px;
      border-top: 1px solid #e2e8f0;
      color: #334155;
    }

    tr.summary-row-remark td {
      background-color: #fff7ed;
    }

    /* Status Badges */
    .status-badge {
      padding: 4px 12px;
      border-radius: 9999px;
      font-weight: 800;
      font-size: 11px;
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .status-badge.pass {
      background: #dcfce7;
      color: #15803d;
      border: 1px solid #86efac;
    }

    .status-badge.remark {
      background: #ffedd5;
      color: #c2410c;
      border: 1px solid #fdba74;
    }

    /* Metric Badges */
    .badge {
      padding: 3px 10px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 11px;
      display: inline-block;
    }

    .badge-good {
      background: #dcfce7;
      color: #15803d;
    }

    .badge-watch {
      background: #fef2f2;
      color: #b91c1c;
      border: 1px solid #fca5a5;
      font-weight: 800;
    }

    .badge-neutral {
      background: #f1f5f9;
      color: #64748b;
    }

    /* Membrane Cards */
    .membrane-card {
      background: white;
      border-radius: 20px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
      margin-bottom: 28px;
      overflow: hidden;
    }

    .membrane-card.is-remark {
      border: 2px solid #f59e0b;
      box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.15);
    }

    .card-header {
      padding: 18px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e2e8f0;
    }

    .card-header.pass {
      background: linear-gradient(to right, #f0f9ff, #f8fafc);
    }

    .card-header.remark {
      background: linear-gradient(to right, #fef3c7, #fff7ed);
      border-bottom-color: #fde68a;
    }

    .card-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
    }

    .card-body {
      padding: 24px;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      margin-bottom: 16px;
    }

    .meta-item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 12px 16px;
      border-radius: 12px;
    }

    .meta-label {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 0.05em;
    }

    .meta-value {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 4px;
      display: block;
    }

    .remark-box {
      background: #fffbe1;
      border: 1px solid #fde047;
      border-left: 5px solid #d97706;
      padding: 14px 18px;
      border-radius: 12px;
      color: #78350f;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 20px;
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }

    .photo-section {
      background: #0f172a;
      color: white;
      border-radius: 16px;
      padding: 20px;
      margin-top: 20px;
    }

    .photo-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 10px;
      margin-top: 8px;
    }

    @media (max-width: 768px) {
      .photo-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .photo-item {
      position: relative;
      aspect-ratio: 1 / 1;
      border-radius: 10px;
      overflow: hidden;
      background: #1e293b;
      border: 2px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .photo-item:hover {
      transform: scale(1.04);
    }

    .photo-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .photo-idx {
      position: absolute;
      bottom: 4px;
      right: 4px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      font-size: 10px;
      font-weight: 800;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    @media print {
      @page {
        size: A4 portrait;
        margin: 8mm 10mm;
      }
      body {
        background: white !important;
        padding: 0 !important;
        color: #0f172a !important;
        font-size: 11px;
      }
      .container {
        max-width: 100% !important;
        padding: 0 !important;
      }
      .btn-print {
        display: none !important;
      }
      .masthead {
        box-shadow: none !important;
        border-radius: 12px !important;
        padding: 16px 20px !important;
        background: #0b1b35 !important;
        color: white !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        page-break-inside: avoid;
        break-inside: avoid;
        margin-bottom: 16px !important;
      }
      .masthead-title { font-size: 20px !important; }
      .stats-bar { margin-top: 10px !important; gap: 8px !important; }
      .stat-pill { padding: 4px 10px !important; font-size: 11px !important; }

      .section-card {
        page-break-inside: avoid;
        break-inside: avoid;
        box-shadow: none !important;
        padding: 16px !important;
        border-radius: 12px !important;
        margin-bottom: 16px !important;
      }

      .membrane-card {
        page-break-inside: avoid;
        break-inside: avoid;
        page-break-after: always;
        break-after: page;
        box-shadow: none !important;
        border: 1px solid #cbd5e1 !important;
        border-radius: 12px !important;
        margin-bottom: 0 !important;
      }

      .membrane-card:last-child {
        page-break-after: auto;
        break-after: auto;
      }

      .card-header {
        padding: 10px 16px !important;
      }
      .card-header h2 {
        font-size: 16px !important;
      }
      .card-body {
        padding: 12px 16px !important;
      }

      .meta-grid {
        gap: 8px !important;
        margin-bottom: 10px !important;
      }
      .meta-item {
        padding: 6px 10px !important;
        border-radius: 8px !important;
      }
      .meta-label { font-size: 9px !important; }
      .meta-value { font-size: 12px !important; margin-top: 2px !important; }

      .remark-box {
        padding: 8px 12px !important;
        margin-bottom: 10px !important;
        font-size: 11px !important;
      }

      table {
        margin: 6px 0 !important;
        font-size: 11px !important;
      }
      th {
        padding: 6px 8px !important;
        font-size: 10px !important;
        background-color: #0f172a !important;
        color: white !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      td {
        padding: 4px 8px !important;
      }

      .photo-section {
        padding: 12px 14px !important;
        margin-top: 10px !important;
        border-radius: 10px !important;
        background: #0f172a !important;
        color: white !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        page-break-inside: avoid;
        break-inside: avoid;
      }
      .photo-grid {
        gap: 6px !important;
        margin-top: 4px !important;
      }
      .photo-item {
        border-radius: 6px !important;
      }
      .photo-item img {
        object-fit: cover !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header Banner -->
    <header class="masthead">
      <div class="masthead-subtitle">${reportSubtitle}</div>
      <h1 class="masthead-title">${reportTitle}</h1>
      <div class="masthead-meta">${companyName} &middot; ${jobDescription}</div>
      
      <div class="stats-bar">
        <div class="stat-pill">
          <span>📅 ช่วงเวลาปฏิบัติงาน: <strong>${servicePeriod}</strong></span>
        </div>
        <div class="stat-pill">
          <span>ไส้กรองทั้งหมด: <strong>${membranes.length}</strong> ชิ้น</span>
        </div>
        <div class="stat-pill pass">
          <span>✓ PASS: <strong>${passCount}</strong></span>
        </div>
        <div class="stat-pill remark">
          <span>⚠️ REMARK: <strong>${remarkCount}</strong></span>
        </div>

        <button class="btn-print" onclick="window.print()">
          🖨️ พิมพ์ / บันทึก PDF
        </button>
      </div>
    </header>

    <!-- Executive Summary Table -->
    <section class="section-card">
      <h2 class="section-title">📋 สรุปผลการตรวจสอบ Membrane ทั้งหมด</h2>
      <table>
        <thead>
          <tr>
            <th style="width: 12%; text-align: center;">ลำดับ</th>
            <th style="width: 20%;">Serial Number</th>
            <th style="width: 20%;">Brand / Model</th>
            <th style="width: 20%;">ตำแหน่งติดตั้ง</th>
            <th style="width: 13%; text-align: center;">สถานะ</th>
            <th style="width: 15%;">หมายเหตุ</th>
          </tr>
        </thead>
        <tbody>
          ${summaryRowsHtml}
        </tbody>
      </table>
    </section>

    <!-- Detailed Membrane Cards -->
    <main>
      ${membraneCardsHtml}
    </main>
  </div>

  <!-- Lightbox Modal -->
  <div id="lightbox" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:9999; align-items:center; justify-content:center; padding:20px;" onclick="this.style.display='none'">
    <img id="lightbox-img" style="max-width:90vw; max-height:90vh; border-radius:12px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.5);" src="" />
  </div>

  <script>
    function showPhoto(src) {
      const lb = document.getElementById('lightbox');
      const img = document.getElementById('lightbox-img');
      img.src = src;
      lb.style.display = 'flex';
    }
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const cleanCompany = companyName.replace(/[^a-zA-Z0-9\u0E00-\u0E7F]/g, '_').substring(0, 30);
  a.download = customFilename || `membrane-report-${cleanCompany}-${new Date().toISOString().slice(0, 10)}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
