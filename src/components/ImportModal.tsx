import React, { useState, useRef } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Download,
  Loader2,
  X,
  Building2,
  Cpu,
  Layers,
  ArrowRight,
  Database
} from 'lucide-react';
import { MembraneData, Company, ROSystem } from '../types';
import {
  parsePdfOrImageDocument,
  parseExcelReport,
  downloadSampleExcelTemplate,
  ParsedReportResult
} from '../utils/fileParser';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: Company[];
  roSystems: ROSystem[];
  onImportComplete: (
    companyName: string,
    roName: string,
    membranes: MembraneData[]
  ) => Promise<void>;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  companies,
  roSystems,
  onImportComplete
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<ParsedReportResult | null>(null);

  const [companyName, setCompanyName] = useState<string>('');
  const [roName, setRoName] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFilesChange = async (selectedFiles: FileList | File[]) => {
    const fileArray = Array.from(selectedFiles);
    if (fileArray.length === 0) return;

    setFiles(fileArray);
    setErrorMsg(null);
    setParsedResult(null);
    setIsProcessing(true);

    try {
      let result: ParsedReportResult;

      // Check if any excel file is present
      const excelFile = fileArray.find((f) =>
        ['xlsx', 'xls', 'csv'].some((ext) => f.name.toLowerCase().endsWith(ext))
      );

      if (excelFile && fileArray.length === 1) {
        result = await parseExcelReport(excelFile);
      } else {
        // Send all files (e.g., PDF 1: Per Piece Report + PDF 2: Service Report)
        result = await parsePdfOrImageDocument(fileArray);
      }

      setParsedResult(result);
      setCompanyName(result.companyName);
      setRoName(result.roName);
    } catch (err: any) {
      console.error('Import error:', err);
      setErrorMsg(err.message || 'เกิดข้อผิดพลาดในการอ่านไฟล์');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesChange(e.dataTransfer.files);
    }
  };

  const handleConfirmImport = async () => {
    if (!parsedResult || !companyName.trim() || !roName.trim()) {
      setErrorMsg('กรุณาระบุชื่อบริษัทและชื่อระบบ RO ให้ครบถ้วน');
      return;
    }

    setIsSaving(true);
    try {
      await onImportComplete(companyName.trim(), roName.trim(), parsedResult.membranes);
      onClose();
    } catch (err: any) {
      console.error('Failed to import data:', err);
      setErrorMsg('เกิดข้อผิดพลาดในการบันทึกข้อมูลเข้าคลาวด์');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setParsedResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0b1b35] via-[#0f3970] to-[#156dd1] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
              <Upload className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">นำเข้าข้อมูลรายงานอัตโนมัติ (PDF / Excel Importer)</h2>
              <p className="text-xs text-blue-200 font-medium">
                รองรับรายงาน PDF 30 หน้า, ไฟล์ Excel (.xlsx) และสกัดชื่อบริษัท / RO / ไส้กรองทั้งหมดให้อัตโนมัติด้วย AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!parsedResult && !isProcessing && (
            <div className="space-y-6">
              {/* Dropzone */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50 rounded-3xl p-10 text-center cursor-pointer transition-all space-y-4 group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.xlsx,.xls,.csv,image/*"
                  onChange={(e) => e.target.files && handleFilesChange(e.target.files)}
                  className="hidden"
                />

                <div className="w-16 h-16 bg-blue-600/10 text-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <p className="text-base font-bold text-slate-800">
                    ลากไฟล์เอกสารรายงาน PDF (เลือกได้หลายไฟล์พร้อมกัน) หรือ Excel มาวางที่นี่
                  </p>
                  <p className="text-xs text-slate-500">
                    หรือคลิกเพื่อเลือกไฟล์ (สามารถเลือกได้พร้อมกัน เช่น ไฟล์รายงานรายท่อน + ไฟล์สรุปบริการลูกค้า)
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-[11px] font-bold border border-rose-200">
                    <FileText className="w-3.5 h-3.5" /> รายงาน PDF (เช่น PDF 30 หน้า)
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-bold border border-emerald-200">
                    <FileSpreadsheet className="w-3.5 h-3.5" /> ไฟล์ Excel / CSV
                  </span>
                </div>
              </div>

              {/* Sample Template Download Option */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">ต้องการแม่แบบไฟล์ Excel ตัวอย่าง?</p>
                    <p className="text-[11px] text-slate-500">
                      ดาวน์โหลดไฟล์ Excel ตัวอย่าง Lion RO4 (30 ท่อน) เพื่อนำไปกรอกหรือทดสอบระบบได้ทันที
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={downloadSampleExcelTemplate}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" /> ดาวน์โหลด Template
                </button>
              </div>
            </div>
          )}

          {/* Loading / Processing State */}
          {isProcessing && (
            <div className="py-16 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping opacity-25" />
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-base text-slate-800">
                  กำลังอ่านและวิเคราะห์สกัดข้อมูลเอกสารด้วย AI...
                </p>
                <p className="text-xs text-slate-500">
                  ระบบกำลังอ่านรายชื่อบริษัท, ระบบ RO, หมายเลข Serial, ค่าแรงดัน, อัตราไหล และผลการทดสอบทั้งหมด ({files.map((f) => f.name).join(', ')})
                </p>
              </div>
            </div>
          )}

          {/* Error Message Banner */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-rose-800 text-xs">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="font-bold">เกิดข้อผิดพลาดในการประมวลผลไฟล์</p>
                <p>{errorMsg}</p>
                <button
                  onClick={handleReset}
                  className="mt-2 text-rose-700 underline font-bold hover:text-rose-900 cursor-pointer"
                >
                  ลองใหม่อีกครั้ง
                </button>
              </div>
            </div>
          )}

          {/* Parsed Result Preview Section */}
          {parsedResult && !isProcessing && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h3 className="font-bold text-sm text-emerald-950">
                      สกัดข้อมูลสำเร็จ! พบรายการไส้กรองทั้งหมด {parsedResult.membranes.length} ท่อน
                    </h3>
                    <p className="text-xs text-emerald-700">
                      ตรวจสอบและปรับแต่งชื่อบริษัทหรือระบบ RO ด้านล่างก่อนกดยืนยันบันทึกลงคลาวด์
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 underline cursor-pointer"
                >
                  เลือกไฟล์อื่น
                </button>
              </div>

              {/* Target Company & RO Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-600" /> ชื่อบริษัทลูกค้า (Company Name)
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="เช่น Lion Corporation (Thailand) Limited"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-blue-600" /> ชื่อระบบ RO (RO System Name)
                  </label>
                  <input
                    type="text"
                    value={roName}
                    onChange={(e) => setRoName(e.target.value)}
                    placeholder="เช่น RO4 Pass 1"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Extracted Data Summary Badges */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 text-center">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">จำนวนไส้กรองทั้งหมด</p>
                  <p className="text-xl font-black text-blue-900">{parsedResult.membranes.length} ท่อน</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">ผ่านเกณฑ์ (PASS)</p>
                  <p className="text-xl font-black text-emerald-900">{parsedResult.rawSummary?.passCount} ท่อน</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">มีข้อสังเกต (REMARK)</p>
                  <p className="text-xl font-black text-amber-900">{parsedResult.rawSummary?.remarkCount} ท่อน</p>
                </div>
              </div>

              {/* Membrane List Table Preview */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-600" /> ตัวอย่างรายการไส้กรองที่สกัดได้ (Preview)
                  </span>
                  <span className="text-[11px] text-slate-500">แสดงผลเรียงลำดับ Membrane No. 1 ถึง {parsedResult.membranes.length}</span>
                </div>

                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 bg-white">
                  {parsedResult.membranes.map((m) => (
                    <div key={`preview-m-${m.membraneNo}`} className="p-3 hover:bg-slate-50 flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                          #{m.membraneNo}
                        </span>
                        <div>
                          <p className="font-bold text-slate-800">
                            Serial: <span className="text-blue-700">{m.serialNumber}</span> &middot; {m.brandModel}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate max-w-xs">{m.note}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {m.images?.before?.[0] && (
                          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200" title="รูปภาพก่อน-หลังล้าง">
                            <img src={m.images.before[0]} alt="Before" className="w-12 h-8 object-cover rounded border border-slate-300" />
                            {m.images?.after?.[0] && (
                              <img src={m.images.after[0]} alt="After" className="w-12 h-8 object-cover rounded border border-slate-300" />
                            )}
                          </div>
                        )}

                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            m.status === 'PASS'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {m.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
          >
            ยกเลิก
          </button>

          {parsedResult && (
            <button
              type="button"
              onClick={handleConfirmImport}
              disabled={isSaving}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> กำลังบันทึกลงคลาวด์...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" /> บันทึกนำเข้าคลาวด์ทั้งหมด ({parsedResult.membranes.length} ท่อน)
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
