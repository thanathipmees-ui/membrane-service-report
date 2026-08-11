import React from 'react';
import { MembraneData, HeaderConfig } from '../types';
import { Plus, Download, Layers, CheckCircle2, AlertTriangle, FileText, Upload } from 'lucide-react';

interface MastheadProps {
  membranes: MembraneData[];
  headerConfig?: HeaderConfig;
  companyName?: string;
  roName?: string;
  onNewReport: () => void;
  onImportClick: () => void;
  onExportHtml: () => void;
}

export const Masthead: React.FC<MastheadProps> = ({
  membranes,
  headerConfig,
  companyName,
  roName,
  onNewReport,
  onImportClick,
  onExportHtml,
}) => {
  const passCount = membranes.filter(m => m.status === 'PASS').length;
  const remarkCount = membranes.filter(m => m.status === 'REMARK').length;

  const subtitle = headerConfig?.reportSubtitle || 'Service Report';
  const title = roName ? `${roName} Membrane Cleaning Report` : (headerConfig?.reportTitle || 'RO Membrane Cleaning Report');
  const company = companyName || headerConfig?.companyName || 'Lion Corporation (Thailand) Limited';

  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-[#0b1b35] via-[#0f3970] to-[#156dd1] text-white px-4 sm:px-8 py-8 shadow-xl">
      {/* Decorative ambient background rings */}
      <div className="absolute -right-16 -bottom-24 w-96 h-96 border border-cyan-400/20 rounded-full pointer-events-none transform -rotate-12 shadow-[0_0_50px_rgba(80,200,233,0.1)]" />
      <div className="absolute right-20 -bottom-32 w-80 h-80 border border-cyan-300/10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-300 font-extrabold text-xs tracking-wider uppercase bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-cyan-400/20 mb-3">
              <FileText className="w-3.5 h-3.5 text-cyan-300" />
              {subtitle}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {title}
            </h1>
            <p className="text-cyan-100 font-medium text-sm sm:text-base mt-1">
              {company} &middot; ระบบจัดการและบันทึกผลการล้างไส้กรอง
            </p>
          </div>

          {/* Quick Stats & Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 text-xs text-slate-100">
              <Layers className="w-4 h-4 text-cyan-300" />
              <span>ทั้งหมด <strong>{membranes.length}</strong> ชิ้น</span>
            </div>

            <div className="flex items-center gap-1.5 bg-emerald-950/40 backdrop-blur-md px-3 py-2 rounded-xl border border-emerald-400/30 text-xs text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>PASS <strong>{passCount}</strong></span>
            </div>

            <div className="flex items-center gap-1.5 bg-amber-950/40 backdrop-blur-md px-3 py-2 rounded-xl border border-amber-400/30 text-xs text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>REMARK <strong>{remarkCount}</strong></span>
            </div>

            <button
              onClick={onImportClick}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-blue-900/40 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Upload className="w-4 h-4 stroke-[2.5]" />
              <span>นำเข้า PDF/Excel</span>
            </button>

            <button
              onClick={onNewReport}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-900/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>สร้าง Report หน้าใหม่</span>
            </button>

            <button
              onClick={onExportHtml}
              className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white font-medium text-xs px-3 py-2.5 rounded-xl border border-white/20 transition-all cursor-pointer"
              title="ดาวน์โหลดไฟล์รายงานแบบ HTML"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export HTML</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
