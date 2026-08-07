import React from 'react';
import { MembraneData, HeaderConfig } from '../types';
import { X, Download, FileText, CheckCircle2, AlertTriangle, Layers, Building2, ExternalLink } from 'lucide-react';
import { exportHtmlFile, getMembraneHeader, defaultHeaderConfig } from '../utils/calculations';

export interface CompanyGroup {
  id: string;
  companyName: string;
  headerConfig: HeaderConfig;
  membranes: MembraneData[];
  passCount: number;
  remarkCount: number;
  minNo: number;
  maxNo: number;
}

export function groupMembranesByCompany(membranes: MembraneData[]): CompanyGroup[] {
  const groupsMap = new Map<string, { headerConfig: HeaderConfig; membranes: MembraneData[] }>();

  membranes.forEach(m => {
    const config = getMembraneHeader(m);
    const companyKey = (config.companyName || defaultHeaderConfig.companyName).trim().toLowerCase();
    const jobKey = (config.jobDescription || defaultHeaderConfig.jobDescription).trim().toLowerCase();
    const key = `${companyKey}::${jobKey}`;

    if (!groupsMap.has(key)) {
      groupsMap.set(key, {
        headerConfig: config,
        membranes: [m]
      });
    } else {
      groupsMap.get(key)!.membranes.push(m);
    }
  });

  const result: CompanyGroup[] = [];
  let index = 1;

  groupsMap.forEach((val) => {
    const mems = val.membranes;
    const nos = mems.map(m => Number(m.membraneNo) || 0);
    const passCount = mems.filter(m => m.status === 'PASS').length;
    const remarkCount = mems.filter(m => m.status === 'REMARK').length;

    result.push({
      id: `group-${index++}`,
      companyName: val.headerConfig.companyName || defaultHeaderConfig.companyName,
      headerConfig: val.headerConfig,
      membranes: mems,
      passCount,
      remarkCount,
      minNo: nos.length > 0 ? Math.min(...nos) : 0,
      maxNo: nos.length > 0 ? Math.max(...nos) : 0
    });
  });

  return result;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  membranes: MembraneData[];
  currentMembrane?: MembraneData;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  membranes,
  currentMembrane
}) => {
  if (!isOpen) return null;

  const groups = groupMembranesByCompany(membranes);
  const currentCompany = currentMembrane ? (getMembraneHeader(currentMembrane).companyName || '').trim().toLowerCase() : '';

  const handleExportGroup = (group: CompanyGroup) => {
    const cleanCompany = group.companyName.replace(/[^a-zA-Z0-9\u0E00-\u0E7F]/g, '_').substring(0, 30);
    const filename = `RO_Report_${cleanCompany}_${new Date().toISOString().slice(0, 10)}.html`;
    exportHtmlFile(group.membranes, group.headerConfig, filename);
  };

  const handleExportAllSeparately = () => {
    groups.forEach((group, idx) => {
      setTimeout(() => {
        handleExportGroup(group);
      }, idx * 400);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">ส่งออกรายงาน HTML (Export HTML Report)</h2>
              <p className="text-xs text-slate-300">
                พบทั้งหมด <strong>{groups.length}</strong> กลุ่มบริษัท / Job (รวม {membranes.length} รายการ)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Quick Notice Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-blue-900">
            <FileText className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-extrabold text-blue-950 block mb-1">
                ระบบเปิดให้เลือก Export แยกตามบริษัทโดยอัตโนมัติ
              </strong>
              ข้อมูลจะถูกแยกไฟล์ตามชื่อบริษัทและหัวข้อรายงาน เพื่อให้แต่ละรายงานมีเฉพาะข้อมูลไส้กรองและสรุปผลของบริษัทนั้นๆ
            </div>
          </div>

          {/* Action to download all separately if multiple groups exist */}
          {groups.length > 1 && (
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-4 rounded-2xl">
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">
                  ต้องการดาวน์โหลดรายงานของทุกบริษัทพร้อมกัน?
                </span>
                <span className="text-[11px] text-slate-500">
                  ดาวน์โหลดไฟล์ HTML แยกรายบริษัท ทั้งหมด {groups.length} ไฟล์
                </span>
              </div>
              <button
                onClick={handleExportAllSeparately}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>ดาวน์โหลดแยกไฟล์ทั้งหมด ({groups.length} ไฟล์)</span>
              </button>
            </div>
          )}

          {/* List of Company Groups */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              รายการกลุ่มบริษัท / รายงาน (Select Company to Export)
            </h3>

            {groups.map((group) => {
              const isCurrent = group.companyName.trim().toLowerCase() === currentCompany;
              const rangeStr = group.minNo === group.maxNo ? `No. ${group.minNo}` : `No. ${group.minNo} - No. ${group.maxNo}`;

              return (
                <div
                  key={group.id}
                  className={`border rounded-2xl p-5 transition-all relative ${
                    isCurrent
                      ? 'border-blue-500 bg-blue-50/30 ring-2 ring-blue-500/20 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <h4 className="text-base font-extrabold text-slate-900">
                          {group.companyName}
                        </h4>
                        {isCurrent && (
                          <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            📍 หน้าปัจจุบัน
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-slate-600">
                        {group.headerConfig.reportTitle} &middot; <span className="text-slate-500">{group.headerConfig.jobDescription}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                          <Layers className="w-3.5 h-3.5 text-blue-500" />
                          <span>{rangeStr} ({group.membranes.length} รายการ)</span>
                        </span>

                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>PASS {group.passCount}</span>
                        </span>

                        {group.remarkCount > 0 && (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-lg">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>REMARK {group.remarkCount}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleExportGroup(group)}
                      className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer shrink-0 self-start sm:self-center"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export HTML บริษัทนี้</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            ไฟล์ HTML ที่ดาวน์โหลดสามารถเปิดได้ทุกเบราว์เซอร์ และพิมพ์เป็น PDF ได้ทันที
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
