import React, { useState, useEffect, useRef } from 'react';
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
  Database,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit3,
  Calendar,
  Image as ImageIcon,
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react';
import { MembraneData, Company, ROSystem, TestCycle } from '../types';
import {
  parsePdfOrImageDocument,
  parseExcelReport,
  downloadSampleExcelTemplate,
  ParsedReportResult
} from '../utils/fileParser';
import { calculateRecovery, calculateRejection } from '../utils/calculations';

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
  const [editableMembranes, setEditableMembranes] = useState<MembraneData[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Inspector tab & selection state
  const [activeMode, setActiveMode] = useState<'overview' | 'inspector'>('overview');
  const [inspectorIndex, setInspectorIndex] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Reset state on open/close
  useEffect(() => {
    if (isOpen) {
      handleReset();
    }
  }, [isOpen]);

  const handleReset = () => {
    setFiles([]);
    setIsProcessing(false);
    setErrorMsg(null);
    setParsedResult(null);
    setCompanyName('');
    setRoName('');
    setEditableMembranes([]);
    setIsSaving(false);
    setActiveMode('overview');
    setInspectorIndex(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

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
        result = await parsePdfOrImageDocument(fileArray);
      }

      setParsedResult(result);
      setCompanyName(result.companyName);
      setRoName(result.roName);
      setEditableMembranes(result.membranes);
      setInspectorIndex(0);
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

    if (editableMembranes.length === 0) {
      setErrorMsg('ไม่พบข้อมูลไส้กรองสำหรับการนำเข้า');
      return;
    }

    setIsSaving(true);
    try {
      await onImportComplete(companyName.trim(), roName.trim(), editableMembranes);
      handleClose();
    } catch (err: any) {
      console.error('Failed to import data:', err);
      setErrorMsg('เกิดข้อผิดพลาดในการบันทึกข้อมูลเข้าคลาวด์');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to update field of current membrane in inspector
  const updateCurrentMembrane = (field: keyof MembraneData, value: any) => {
    setEditableMembranes((prev) =>
      prev.map((m, idx) => (idx === inspectorIndex ? { ...m, [field]: value } : m))
    );
  };

  // Helper to update location
  const updateCurrentLocation = (field: 'vessel' | 'position', value: number) => {
    setEditableMembranes((prev) =>
      prev.map((m, idx) =>
        idx === inspectorIndex
          ? {
              ...m,
              location: {
                ...m.location,
                [field]: value
              }
            }
          : m
      )
    );
  };

  // Helper to update cycle readings
  const updateCycleReading = (
    cycleIndex: number,
    phase: 'before' | 'after',
    field: string,
    val: number
  ) => {
    setEditableMembranes((prev) =>
      prev.map((m, idx) => {
        if (idx !== inspectorIndex) return m;

        const updatedCycles = [...m.cycles];
        const cycle = { ...updatedCycles[cycleIndex] };
        const updatedPhase = { ...cycle[phase], [field]: val };

        // Recalculate Recovery and Rejection if inputs changed
        if (field === 'inletFlow' || field === 'concentrateFlow') {
          updatedPhase.recovery = calculateRecovery(
            updatedPhase.inletFlow,
            updatedPhase.concentrateFlow
          );
        }
        if (field === 'permeateConductivity' || field === 'rawWaterConductivity') {
          updatedPhase.rejection = calculateRejection(
            updatedPhase.permeateConductivity,
            updatedPhase.rawWaterConductivity
          );
        }

        cycle[phase] = updatedPhase;
        updatedCycles[cycleIndex] = cycle;

        return { ...m, cycles: updatedCycles };
      })
    );
  };

  const currentInspectorMembrane = editableMembranes[inspectorIndex];
  const passCount = editableMembranes.filter((m) => m.status === 'PASS').length;
  const remarkCount = editableMembranes.filter((m) => m.status === 'REMARK').length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0b1b35] via-[#0f3970] to-[#156dd1] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
              <Upload className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">นำเข้าข้อมูลรายงานอัตโนมัติ (PDF / Excel Importer)</h2>
              <p className="text-xs text-blue-200 font-medium">
                อ่านข้อมูล PDF/Excel + ตรวจเช็คปรับแต่งรายท่อนก่อนบันทึกลงคลาวด์
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
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
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Header Status Bar & View Mode Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900 text-white p-4 rounded-2xl gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      สกัดข้อมูลสำเร็จ {editableMembranes.length} ท่อน
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                        พร้อมบันทึก
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300">
                      คุณสามารถสลับโหมดเพื่อตรวจเช็ค/แก้ไขข้อมูลรายท่อนได้ก่อนกดยืนยัน
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveMode('overview')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeMode === 'overview'
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" /> ภาพรวม ({editableMembranes.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMode('inspector')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeMode === 'inspector'
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" /> ตรวจเช็คทีละท่อน (#{inspectorIndex + 1})
                  </button>
                </div>
              </div>

              {/* Target Company & RO Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="space-y-1">
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

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-blue-600" /> ชื่อระบบ RO (RO System Name)
                  </label>
                  <input
                    type="text"
                    value={roName}
                    onChange={(e) => setRoName(e.target.value)}
                    placeholder="เช่น RO2"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* MODE 1: OVERVIEW TAB */}
              {activeMode === 'overview' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Summary Badges */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 text-center">
                      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">จำนวนไส้กรองทั้งหมด</p>
                      <p className="text-xl font-black text-blue-900">{editableMembranes.length} ท่อน</p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">ผ่านเกณฑ์ (PASS)</p>
                      <p className="text-xl font-black text-emerald-900">{passCount} ท่อน</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">มีข้อสังเกต (REMARK)</p>
                      <p className="text-xl font-black text-amber-900">{remarkCount} ท่อน</p>
                    </div>
                  </div>

                  {/* Membrane List Preview Table */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-blue-600" /> ตารางรายการไส้กรองที่สกัดได้
                      </span>
                      <span className="text-[11px] text-slate-500">คลิกที่ไส้กรองใดก็ได้เพื่อเปิดโหมดตรวจเช็คทีละท่อน</span>
                    </div>

                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 bg-white">
                      {editableMembranes.map((m, idx) => (
                        <div
                          key={`preview-m-${m.membraneNo}-${idx}`}
                          onClick={() => {
                            setInspectorIndex(idx);
                            setActiveMode('inspector');
                          }}
                          className={`p-3 hover:bg-blue-50/60 transition-colors flex items-center justify-between text-xs gap-3 cursor-pointer ${
                            inspectorIndex === idx ? 'bg-blue-50/80 border-l-4 border-blue-600' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0">
                              #{m.membraneNo}
                            </span>
                            <div>
                              <p className="font-bold text-slate-800 flex items-center gap-2">
                                Serial: <span className="text-blue-700 font-extrabold">{m.serialNumber}</span>
                                <span className="text-slate-400 font-normal">&middot; {m.brandModel}</span>
                              </p>
                              <p className="text-[11px] text-slate-500 truncate max-w-sm">{m.note}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
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

                            <button
                              type="button"
                              className="px-2 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 rounded-lg text-[11px] font-bold transition-all"
                            >
                              ตรวจเช็ค &gt;
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 2: STEP-BY-STEP INSPECTOR TAB */}
              {activeMode === 'inspector' && currentInspectorMembrane && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Step Selector Ribbon (#1 to #N) */}
                  <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" /> เลือกตรวจเช็คไส้กรอง (Membrane No. 1 ถึง {editableMembranes.length}):
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setInspectorIndex((prev) => Math.max(0, prev - 1))}
                          disabled={inspectorIndex === 0}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" /> ก่อนหน้า
                        </button>
                        <span className="font-black text-blue-900 bg-blue-100 px-2.5 py-1 rounded-lg">
                          {inspectorIndex + 1} / {editableMembranes.length}
                        </span>
                        <button
                          type="button"
                          onClick={() => setInspectorIndex((prev) => Math.min(editableMembranes.length - 1, prev + 1))}
                          disabled={inspectorIndex === editableMembranes.length - 1}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                        >
                          ถัดไป <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Scrollable button pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-thin">
                      {editableMembranes.map((m, idx) => {
                        const isCurrent = idx === inspectorIndex;
                        const isPass = m.status === 'PASS';
                        return (
                          <button
                            key={`inspector-pill-${m.membraneNo}-${idx}`}
                            type="button"
                            onClick={() => setInspectorIndex(idx)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 border cursor-pointer ${
                              isCurrent
                                ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-400/50 scale-105'
                                : isPass
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100'
                            }`}
                          >
                            <span>#{m.membraneNo}</span>
                            <span className="text-[10px] font-medium opacity-90 truncate max-w-[70px]">
                              {m.serialNumber}
                            </span>
                            {isPass ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <AlertCircle className="w-3 h-3 text-rose-600" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected Membrane Form Editor */}
                  <div className="bg-white border-2 border-blue-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-base shadow shrink-0">
                          #{currentInspectorMembrane.membraneNo}
                        </span>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                            รายละเอียดไส้กรองท่อนที่ {currentInspectorMembrane.membraneNo}
                          </h4>
                          <p className="text-xs text-slate-500">
                            ตรวจสอบและแก้ไขข้อมูลของท่อนนี้ได้โดยตรง
                          </p>
                        </div>
                      </div>

                      {/* Status switch */}
                      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
                        <span className="text-xs font-bold text-slate-600 pl-2">ผลการตรวจสอบ:</span>
                        <button
                          type="button"
                          onClick={() => updateCurrentMembrane('status', 'PASS')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentInspectorMembrane.status === 'PASS'
                              ? 'bg-emerald-500 text-white shadow'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          PASS
                        </button>
                        <button
                          type="button"
                          onClick={() => updateCurrentMembrane('status', 'REMARK')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentInspectorMembrane.status === 'REMARK'
                              ? 'bg-rose-500 text-white shadow'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          REMARK
                        </button>
                      </div>
                    </div>

                    {/* Inputs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Serial Number</label>
                        <input
                          type="text"
                          value={currentInspectorMembrane.serialNumber}
                          onChange={(e) => updateCurrentMembrane('serialNumber', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">ยี่ห้อ / รุ่น (Brand & Model)</label>
                        <input
                          type="text"
                          value={currentInspectorMembrane.brandModel}
                          onChange={(e) => updateCurrentMembrane('brandModel', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">ตำแหน่งในระบบ (Vessel / Position)</label>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-bold">Vessel</span>
                          <input
                            type="number"
                            min={1}
                            value={currentInspectorMembrane.location?.vessel || 1}
                            onChange={(e) => updateCurrentLocation('vessel', parseInt(e.target.value) || 1)}
                            className="w-16 bg-slate-50 border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-bold text-center text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-xs text-slate-500 font-bold">Pos</span>
                          <input
                            type="number"
                            min={1}
                            value={currentInspectorMembrane.location?.position || 1}
                            onChange={(e) => updateCurrentLocation('position', parseInt(e.target.value) || 1)}
                            className="w-16 bg-slate-50 border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-bold text-center text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Note Input */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">หมายเหตุ (Note)</label>
                      <input
                        type="text"
                        value={currentInspectorMembrane.note}
                        onChange={(e) => updateCurrentMembrane('note', e.target.value)}
                        placeholder="หมายเหตุเพิ่มเติมสำหรับท่อนนี้"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Photos Section (Before & After) */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-blue-600" /> รูปภาพการล้างสำหรับท่อนนี้ (#{currentInspectorMembrane.membraneNo}):
                        </span>
                        <span className="text-[11px] text-slate-500">
                          สกัดจาก PDF อัตโนมัติ หรืออัปโหลด/เปลี่ยนรูปภาพใหม่ได้ที่นี่
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* BEFORE PHOTO CARD */}
                        <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                              📸 ก่อนล้าง (Before)
                            </span>
                            <label className="text-[11px] font-bold text-blue-700 hover:text-blue-900 cursor-pointer underline">
                              {currentInspectorMembrane.images?.before?.[0] ? 'เปลี่ยนรูป' : '+ อัปโหลดรูป'}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    const file = e.target.files[0];
                                    const reader = new FileReader();
                                    reader.readAsDataURL(file);
                                    reader.onload = () => {
                                      const res = reader.result as string;
                                      setEditableMembranes((prev) =>
                                        prev.map((m, idx) =>
                                          idx === inspectorIndex
                                            ? { ...m, images: { ...m.images, before: [res] } }
                                            : m
                                        )
                                      );
                                    };
                                  }
                                }}
                              />
                            </label>
                          </div>

                          {currentInspectorMembrane.images?.before?.[0] ? (
                            <div className="relative group rounded-xl overflow-hidden border border-amber-300 bg-white">
                              <img
                                src={currentInspectorMembrane.images.before[0]}
                                alt="Before"
                                className="w-full h-32 object-contain bg-slate-900/5"
                              />
                            </div>
                          ) : (
                            <div className="h-32 border-2 border-dashed border-amber-300 rounded-xl flex flex-col items-center justify-center text-amber-700 bg-white/60 text-xs">
                              <ImageIcon className="w-6 h-6 opacity-40 mb-1" />
                              <span>ยังไม่มีรูปภาพก่อนล้าง</span>
                            </div>
                          )}
                        </div>

                        {/* AFTER PHOTO CARD */}
                        <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-200/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                              📸 หลังล้าง (After)
                            </span>
                            <label className="text-[11px] font-bold text-blue-700 hover:text-blue-900 cursor-pointer underline">
                              {currentInspectorMembrane.images?.after?.[0] ? 'เปลี่ยนรูป' : '+ อัปโหลดรูป'}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    const file = e.target.files[0];
                                    const reader = new FileReader();
                                    reader.readAsDataURL(file);
                                    reader.onload = () => {
                                      const res = reader.result as string;
                                      setEditableMembranes((prev) =>
                                        prev.map((m, idx) =>
                                          idx === inspectorIndex
                                            ? { ...m, images: { ...m.images, after: [res] } }
                                            : m
                                        )
                                      );
                                    };
                                  }
                                }}
                              />
                            </label>
                          </div>

                          {currentInspectorMembrane.images?.after?.[0] ? (
                            <div className="relative group rounded-xl overflow-hidden border border-emerald-300 bg-white">
                              <img
                                src={currentInspectorMembrane.images.after[0]}
                                alt="After"
                                className="w-full h-32 object-contain bg-slate-900/5"
                              />
                            </div>
                          ) : (
                            <div className="h-32 border-2 border-dashed border-emerald-300 rounded-xl flex flex-col items-center justify-center text-emerald-700 bg-white/60 text-xs">
                              <ImageIcon className="w-6 h-6 opacity-40 mb-1" />
                              <span>ยังไม่มีรูปภาพหลังล้าง</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Test Cycles Table (e.g., 3 dates) */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-blue-600" /> ข้อมูลการทดสอบย้อนหลังทุกรอบ ({currentInspectorMembrane.cycles?.length || 0} วัน)
                      </span>

                      <div className="overflow-x-auto border border-slate-200 rounded-xl">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                              <th className="p-2 font-bold min-w-[110px]">วันที่ (Date)</th>
                              <th className="p-2 font-bold text-center">สถานะ</th>
                              <th className="p-2 font-bold text-center">Inlet (PSI)</th>
                              <th className="p-2 font-bold text-center">Conc (PSI)</th>
                              <th className="p-2 font-bold text-center">Inlet Flow</th>
                              <th className="p-2 font-bold text-center">Conc Flow</th>
                              <th className="p-2 font-bold text-center">% Recovery</th>
                              <th className="p-2 font-bold text-center">Permeate</th>
                              <th className="p-2 font-bold text-center">Raw Water</th>
                              <th className="p-2 font-bold text-center">% Rejection</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {currentInspectorMembrane.cycles?.map((cycle, cIdx) => (
                              <React.Fragment key={`cycle-row-${cIdx}`}>
                                {/* BEFORE ROW */}
                                <tr className="hover:bg-amber-50/40">
                                  <td rowSpan={2} className="p-2 font-extrabold text-slate-800 border-r border-slate-200 bg-slate-50">
                                    {cycle.date}
                                  </td>
                                  <td className="p-1 font-bold text-amber-800 bg-amber-50 text-[11px] text-center">
                                    Before
                                  </td>
                                  <td className="p-1">
                                    <input
                                      type="number"
                                      value={cycle.before.inletPressure}
                                      onChange={(e) => updateCycleReading(cIdx, 'before', 'inletPressure', parseFloat(e.target.value) || 0)}
                                      className="w-14 bg-white border border-slate-200 rounded p-1 text-center font-bold text-xs"
                                    />
                                  </td>
                                  <td className="p-1">
                                    <input
                                      type="number"
                                      value={cycle.before.concentratePressure}
                                      onChange={(e) => updateCycleReading(cIdx, 'before', 'concentratePressure', parseFloat(e.target.value) || 0)}
                                      className="w-14 bg-white border border-slate-200 rounded p-1 text-center font-bold text-xs"
                                    />
                                  </td>
                                  <td className="p-1">
                                    <input
                                      type="number"
                                      value={cycle.before.inletFlow}
                                      onChange={(e) => updateCycleReading(cIdx, 'before', 'inletFlow', parseFloat(e.target.value) || 0)}
                                      className="w-14 bg-white border border-slate-200 rounded p-1 text-center font-bold text-xs"
                                    />
                                  </td>
                                  <td className="p-1">
                                    <input
                                      type="number"
                                      value={cycle.before.concentrateFlow}
                                      onChange={(e) => updateCycleReading(cIdx, 'before', 'concentrateFlow', parseFloat(e.target.value) || 0)}
                                      className="w-14 bg-white border border-slate-200 rounded p-1 text-center font-bold text-xs"
                                    />
                                  </td>
                                  <td className="p-2 text-center font-extrabold text-blue-700 bg-blue-50/50">
                                    {cycle.before.recovery.toFixed(2)}%
                                  </td>
                                  <td className="p-1">
                                    <input
                                      type="number"
                                      value={cycle.before.permeateConductivity}
                                      onChange={(e) => updateCycleReading(cIdx, 'before', 'permeateConductivity', parseFloat(e.target.value) || 0)}
                                      className="w-14 bg-white border border-slate-200 rounded p-1 text-center font-bold text-xs"
                                    />
                                  </td>
                                  <td className="p-1">
                                    <input
                                      type="number"
                                      value={cycle.before.rawWaterConductivity}
                                      onChange={(e) => updateCycleReading(cIdx, 'before', 'rawWaterConductivity', parseFloat(e.target.value) || 0)}
                                      className="w-14 bg-white border border-slate-200 rounded p-1 text-center font-bold text-xs"
                                    />
                                  </td>
                                  <td className="p-2 text-center font-extrabold text-emerald-700 bg-emerald-50/50">
                                    {cycle.before.rejection.toFixed(2)}%
                                  </td>
                                </tr>

                                {/* AFTER ROW */}
                                <tr className="hover:bg-emerald-50/40 border-b-2 border-slate-200">
                                  <td className="p-1 font-bold text-emerald-800 bg-emerald-50 text-[11px] text-center">
                                    After
                                  </td>
                                  <td className="p-1">
                                    <input
                                      type="number"
                                      value={cycle.after.inletPressure}
                                      onChange={(e) => updateCycleReading(cIdx, 'after', 'inletPressure', parseFloat(e.target.value) || 0)}
                                      className="w-14 bg-white border border-slate-200 rounded p-1 text-center font-bold text-xs"
                                    />
                                  </td>
                                  <td className="p-1">
                                    <input
                                      type="number"
                                      value={cycle.after.concentratePressure}
                                      onChange={(e) => updateCycleReading(cIdx, 'after', 'concentratePressure', parseFloat(e.target.value) || 0)}
                                      className="w-14 bg-white border border-slate-200 rounded p-1 text-center font-bold text-xs"
                                    />
                                  </td>
                                  <td className="p-1">
                                    <input
                                      type="number"
                                      value={cycle.after.inletFlow}
                                      onChange={(e) => updateCycleReading(cIdx, 'after', 'inletFlow', parseFloat(e.target.value) || 0)}
                                      className="w-14 bg-white border border-slate-200 rounded p-1 text-center font-bold text-xs"
                                    />
                                  </td>
                                  <td className="p-1">
                                    <input
                                      type="number"
                                      value={cycle.after.concentrateFlow}
                                      onChange={(e) => updateCycleReading(cIdx, 'after', 'concentrateFlow', parseFloat(e.target.value) || 0)}
                                      className="w-14 bg-white border border-slate-200 rounded p-1 text-center font-bold text-xs"
                                    />
                                  </td>
                                  <td className="p-2 text-center font-extrabold text-blue-700 bg-blue-50/50">
                                    {cycle.after.recovery.toFixed(2)}%
                                  </td>
                                  <td className="p-1">
                                    <input
                                      type="number"
                                      value={cycle.after.permeateConductivity}
                                      onChange={(e) => updateCycleReading(cIdx, 'after', 'permeateConductivity', parseFloat(e.target.value) || 0)}
                                      className="w-14 bg-white border border-slate-200 rounded p-1 text-center font-bold text-xs"
                                    />
                                  </td>
                                  <td className="p-1">
                                    <input
                                      type="number"
                                      value={cycle.after.rawWaterConductivity}
                                      onChange={(e) => updateCycleReading(cIdx, 'after', 'rawWaterConductivity', parseFloat(e.target.value) || 0)}
                                      className="w-14 bg-white border border-slate-200 rounded p-1 text-center font-bold text-xs"
                                    />
                                  </td>
                                  <td className="p-2 text-center font-extrabold text-emerald-700 bg-emerald-50/50">
                                    {cycle.after.rejection.toFixed(2)}%
                                  </td>
                                </tr>
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleClose}
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
                  <Database className="w-4 h-4" /> บันทึกนำเข้าคลาวด์ทั้งหมด ({editableMembranes.length} ท่อน)
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

