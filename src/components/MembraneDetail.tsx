import React, { useState, useEffect } from 'react';
import { MembraneData } from '../types';
import { metricDefs, formatNumber, formatPercent, valueText, deltaText, getInterpretation } from '../utils/calculations';
import { TrendChart } from './TrendChart';
import { ImageIcon, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';

interface MembraneDetailProps {
  membrane: MembraneData;
  onOpenPhoto: (src: string, label: string) => void;
}

const ImageThumbnail: React.FC<{
  src: string;
  idx: number;
  type: 'before' | 'after';
  membraneNo: number;
  onOpenPhoto: (src: string, label: string) => void;
}> = ({ src, idx, type, membraneNo, onOpenPhoto }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const isBefore = type === 'before';
  const label = `Membrane ${membraneNo} - ${isBefore ? 'Before' : 'After'} Cleaning / Photo ${idx + 1}`;
  const borderColor = isBefore ? 'hover:border-amber-400' : 'hover:border-emerald-400';

  if (!src || hasError) {
    return (
      <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-800/50 border border-white/10 flex flex-col items-center justify-center p-1 text-slate-400 select-none">
        <ImageIcon className="w-4 h-4 text-slate-500 mb-0.5" />
        <span className="text-[9px] font-semibold text-slate-400 text-center">รูปที่ {idx + 1}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpenPhoto(src, label)}
      className={`group relative aspect-square rounded-xl overflow-hidden bg-slate-800 border border-white/20 cursor-zoom-in transition-all transform hover:scale-105 ${borderColor}`}
    >
      <img
        src={src}
        alt={`${isBefore ? 'Before' : 'After'} ${idx + 1}`}
        className="w-full h-full object-cover"
        onError={() => setHasError(true)}
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
        <Eye className="w-4 h-4 text-white" />
      </div>
      <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-black/70 text-white text-[9px] font-bold flex items-center justify-center">
        {idx + 1}
      </span>
    </button>
  );
};

export const MembraneDetail: React.FC<MembraneDetailProps> = ({ membrane, onOpenPhoto }) => {
  const isRemark = membrane.status === 'REMARK';
  const cycles = membrane.cycles || [];
  const latestCycle = cycles.length > 0 ? cycles[cycles.length - 1] : { date: 'N/A', before: {}, after: {} };
  const before = latestCycle.before || {};
  const after = latestCycle.after || {};

  return (
    <div className={`bg-white rounded-3xl border shadow-xl transition-all duration-300 overflow-hidden ${isRemark ? 'border-amber-300/80 shadow-amber-900/5' : 'border-slate-200 shadow-slate-900/5'}`}>
      {/* Detail Header Bar */}
      <div className={`px-6 sm:px-10 py-6 border-b flex flex-wrap items-center justify-between gap-4 ${isRemark ? 'bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-amber-500/5 border-amber-200' : 'bg-gradient-to-r from-blue-50/80 via-slate-50 to-white border-slate-200'}`}>
        <div>
          <p className={`text-xs font-extrabold uppercase tracking-widest mb-1 ${isRemark ? 'text-amber-700' : 'text-blue-600'}`}>
            Membrane Detail
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Membrane No. {membrane.membraneNo}
          </h2>
        </div>

        <div>
          <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase shadow-sm ${isRemark ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}`}>
            {isRemark ? <AlertCircle className="w-4 h-4 text-amber-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            <span>{membrane.status}</span>
          </span>
        </div>
      </div>

      {/* Identity Cards */}
      <div className="p-6 sm:p-10 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Serial number</span>
            <strong className="block text-sm font-mono text-slate-900 mt-1 uppercase tracking-wide">
              {membrane.serialNumber || '-'}
            </strong>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Brand / model</span>
            <strong className="block text-sm font-medium text-slate-900 mt-1">
              {membrane.brandModel || '-'}
            </strong>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Installed location</span>
            <strong className="block text-sm font-medium text-slate-900 mt-1">
              {membrane.location ? `Vessel ${membrane.location.vessel} / Position ${membrane.location.position}` : 'Not listed'}
            </strong>
          </div>
        </div>

        {/* Note / Remark Box */}
        {membrane.note && (
          <div className={`p-4 rounded-2xl border-l-4 text-xs sm:text-sm font-medium ${isRemark ? 'bg-amber-50/80 border-amber-500 text-amber-900' : 'bg-blue-50/80 border-blue-500 text-blue-900'}`}>
            <strong>หมายเหตุ / Remark:</strong> {membrane.note}
          </div>
        )}

        {/* Visual Condition Photo Galleries */}
        <section className={`rounded-2xl p-6 sm:p-8 text-white ${isRemark ? 'bg-gradient-to-br from-[#7a520f] to-[#4a3000]' : 'bg-gradient-to-br from-[#10213b] to-[#0f3970]'}`}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-extrabold tracking-tight">Visual condition (สภาพปรากฏ)</h3>
              <p className="text-xs text-blue-200/80 mt-0.5">
                รูปถ่ายจากรายงานการล้างไส้กรอง คลิกที่รูปภาพเพื่อขยายดูความคมชัด
              </p>
            </div>
            <span className="text-xs font-bold text-cyan-300 bg-white/10 px-3 py-1 rounded-full border border-white/10 w-fit">
              {latestCycle.date || 'No Date'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before Cleaning Photos */}
            <div className="bg-black/20 rounded-2xl p-4 border border-white/10 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
                Before cleaning (ก่อนล้าง)
              </h4>
              <div className="grid grid-cols-5 gap-2">
                {membrane.images?.before && membrane.images.before.length > 0 ? (
                  membrane.images.before.map((src, idx) => (
                    <ImageThumbnail
                      key={`b-${membrane.membraneNo}-${idx}`}
                      src={src}
                      idx={idx}
                      type="before"
                      membraneNo={membrane.membraneNo}
                      onOpenPhoto={onOpenPhoto}
                    />
                  ))
                ) : (
                  <div className="col-span-5 text-center py-6 text-xs text-slate-400 border border-dashed border-white/10 rounded-xl">
                    ไม่มีรูปถ่ายก่อนล้าง
                  </div>
                )}
              </div>
            </div>

            {/* After Cleaning Photos */}
            <div className="bg-black/20 rounded-2xl p-4 border border-white/10 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                After cleaning (หลังล้าง)
              </h4>
              <div className="grid grid-cols-5 gap-2">
                {membrane.images?.after && membrane.images.after.length > 0 ? (
                  membrane.images.after.map((src, idx) => (
                    <ImageThumbnail
                      key={`a-${membrane.membraneNo}-${idx}`}
                      src={src}
                      idx={idx}
                      type="after"
                      membraneNo={membrane.membraneNo}
                      onOpenPhoto={onOpenPhoto}
                    />
                  ))
                ) : (
                  <div className="col-span-5 text-center py-6 text-xs text-slate-400 border border-dashed border-white/10 rounded-xl">
                    ไม่มีรูปถ่ายหลังล้าง
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Latest Cleaning Results Comparison Table */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Latest cleaning results / ผลทดสอบรอบล่าสุด ({latestCycle.date || '-'})
              </h3>
              <p className="text-xs text-slate-500">เปรียบเทียบค่าก่อนและหลังล้างไส้กรองเมมเบรน</p>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-bold">
              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full">Before cleaning / ก่อนล้าง</span>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">After cleaning / หลังล้าง</span>
              <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full">Change / ผลต่าง</span>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm">
            <table className="w-full min-w-[700px] text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 uppercase font-extrabold text-[10px] tracking-wider text-left border-b border-slate-200">
                  <th className="p-3">Measurement (รายการวัด)</th>
                  <th className="p-3">Unit</th>
                  <th className="p-3">Before cleaning (ก่อนล้าง)</th>
                  <th className="p-3">After cleaning (หลังล้าง)</th>
                  <th className="p-3">Change (ผลต่าง)</th>
                  <th className="p-3">Interpretation (การประเมิน)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {metricDefs.map(metric => {
                  const bVal = before[metric.key];
                  const aVal = after[metric.key];
                  const interp = getInterpretation(metric.goal, bVal, aVal);

                  return (
                    <tr key={metric.key} className="hover:bg-slate-50/80 transition-all">
                      <td className="p-3 font-bold text-slate-800">{metric.label}</td>
                      <td className="p-3 font-medium text-slate-500">{metric.unit}</td>
                      <td className="p-3">
                        <span className="inline-block min-w-[70px] text-right font-bold text-amber-900 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                          {valueText(bVal, metric.unit)}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="inline-block min-w-[70px] text-right font-bold text-emerald-900 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                          {valueText(aVal, metric.unit)}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-700">
                        {deltaText(bVal, aVal, metric.unit)}
                      </td>
                      <td className="p-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${interp.css === 'good' ? 'bg-emerald-100 text-emerald-800' : interp.css === 'watch' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                          {interp.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Performance Trend Charts Section */}
        <section className="space-y-6 border-t border-slate-200 pt-8">
          <div>
            <h3 className="text-base font-bold text-slate-900">Calculated Performance Charts / กราฟสรุปผลการคำนวณ</h3>
            <p className="text-xs text-slate-500">กราฟสร้างอัตโนมัติจากข้อมูลการทดสอบรอบต่างๆ โดยไม่ต้องใช้รูปภาพกราฟภายนอก</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TrendChart
              title="% Recovery (แนวโน้ม % น้ำดีที่ได้)"
              metricKey="recovery"
              unit="%"
              cycles={cycles}
            />
            <TrendChart
              title="% Salt Rejection (แนวโน้ม % การขจัดเกลือ)"
              metricKey="rejection"
              unit="%"
              cycles={cycles}
            />
            <TrendChart
              title="Inlet Flow Rate (อัตราไหลน้ำเข้า L/min)"
              metricKey="inletFlow"
              unit="L/min"
              cycles={cycles}
            />
            <TrendChart
              title="Permeate Conductivity (ค่าการนำไฟฟ้าพรีเมต µS/cm)"
              metricKey="permeateConductivity"
              unit="µS/cm"
              cycles={cycles}
            />
          </div>
        </section>

        {/* Complete Cleaning History Table */}
        <section className="space-y-4 border-t border-slate-200 pt-8">
          <div>
            <h3 className="text-base font-bold text-slate-900">Cleaning history / ตารางผลการล้างทั้งหมด</h3>
            <p className="text-xs text-slate-500">ประวัติและข้อมูลดิบครบถ้วนจากทุกรอบการล้าง</p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm">
            <table className="w-full min-w-[900px] text-xs border-collapse text-left">
              <thead>
                <tr className="bg-slate-100 text-slate-600 font-extrabold uppercase text-[10px] border-b border-slate-200">
                  <th className="p-3">Date</th>
                  <th className="p-3">Stage</th>
                  <th className="p-3 text-right">Inlet Press.<br />(PSI)</th>
                  <th className="p-3 text-right">Conc. Press.<br />(PSI)</th>
                  <th className="p-3 text-right">Inlet Flow<br />(L/min)</th>
                  <th className="p-3 text-right">Conc. Flow<br />(L/min)</th>
                  <th className="p-3 text-right">Recovery<br />(%)</th>
                  <th className="p-3 text-right">Permeate Conduct.<br />(µS/cm)</th>
                  <th className="p-3 text-right">Raw Conduct.<br />(µS/cm)</th>
                  <th className="p-3 text-right">Rejection<br />(%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {cycles.map((cyc, cIdx) => {
                  const bData = cyc.before || {};
                  const aData = cyc.after || {};

                  return (
                    <React.Fragment key={cIdx}>
                      {/* Before Row */}
                      <tr className="bg-amber-50/30">
                        <td className="p-3 font-semibold text-slate-700" rowSpan={2}>
                          {cyc.date}
                        </td>
                        <td className="p-3 font-bold text-amber-800">Before</td>
                        <td className="p-3 text-right font-mono">{formatNumber(bData.inletPressure)}</td>
                        <td className="p-3 text-right font-mono">{formatNumber(bData.concentratePressure)}</td>
                        <td className="p-3 text-right font-mono">{formatNumber(bData.inletFlow)}</td>
                        <td className="p-3 text-right font-mono">{formatNumber(bData.concentrateFlow)}</td>
                        <td className="p-3 text-right font-mono font-bold text-amber-900">{formatPercent(bData.recovery)}</td>
                        <td className="p-3 text-right font-mono">{formatNumber(bData.permeateConductivity)}</td>
                        <td className="p-3 text-right font-mono">{formatNumber(bData.rawWaterConductivity)}</td>
                        <td className="p-3 text-right font-mono font-bold text-amber-900">{formatPercent(bData.rejection)}</td>
                      </tr>

                      {/* After Row */}
                      <tr className="bg-emerald-50/30">
                        <td className="p-3 font-bold text-emerald-800">After</td>
                        <td className="p-3 text-right font-mono">{formatNumber(aData.inletPressure)}</td>
                        <td className="p-3 text-right font-mono">{formatNumber(aData.concentratePressure)}</td>
                        <td className="p-3 text-right font-mono">{formatNumber(aData.inletFlow)}</td>
                        <td className="p-3 text-right font-mono">{formatNumber(aData.concentrateFlow)}</td>
                        <td className="p-3 text-right font-mono font-bold text-emerald-900">{formatPercent(aData.recovery)}</td>
                        <td className="p-3 text-right font-mono">{formatNumber(aData.permeateConductivity)}</td>
                        <td className="p-3 text-right font-mono">{formatNumber(aData.rawWaterConductivity)}</td>
                        <td className="p-3 text-right font-mono font-bold text-emerald-900">{formatPercent(aData.rejection)}</td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};
