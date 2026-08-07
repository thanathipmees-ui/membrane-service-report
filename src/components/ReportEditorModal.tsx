import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, CheckCircle, Image as ImageIcon, Calculator, Info, Building2, Calendar, Plus } from 'lucide-react';
import { MembraneData, MembraneStatus, TestMetrics, TestCycle, HeaderConfig } from '../types';
import { calculateRecovery, calculateRejection, metricDefs } from '../utils/calculations';

interface ReportEditorModalProps {
  isOpen: boolean;
  mode: 'new' | 'edit';
  initialData: MembraneData;
  headerConfig?: HeaderConfig;
  onSave: (data: MembraneData, newHeaderConfig?: HeaderConfig) => void;
  onClose: () => void;
}

export const ReportEditorModal: React.FC<ReportEditorModalProps> = ({
  isOpen,
  mode,
  initialData,
  headerConfig,
  onSave,
  onClose,
}) => {
  // Header Config state
  const [companyName, setCompanyName] = useState<string>(headerConfig?.companyName || 'Lion Corporation (Thailand) Limited');
  const [reportTitle, setReportTitle] = useState<string>(headerConfig?.reportTitle || 'RO4 Pass1 Membrane Cleaning Report');
  const [reportSubtitle, setReportSubtitle] = useState<string>(headerConfig?.reportSubtitle || 'Service Report');
  const [jobDescription, setJobDescription] = useState<string>(headerConfig?.jobDescription || 'Cleaning Membrane RO4 Pass1');
  const [servicePeriod, setServicePeriod] = useState<string>(headerConfig?.servicePeriod || '10-16 June 2026');

  // Membrane Data state
  const [membraneNo, setMembraneNo] = useState<number>(initialData.membraneNo || 1);
  const [serialNumber, setSerialNumber] = useState<string>(initialData.serialNumber || '');
  const [brandModel, setBrandModel] = useState<string>(initialData.brandModel || 'Filmtec / BW30 PRO-400');
  const [status, setStatus] = useState<MembraneStatus>(initialData.status || 'PASS');
  const [vessel, setVessel] = useState<string | number>(initialData.location?.vessel || 1);
  const [position, setPosition] = useState<string | number>(initialData.location?.position || 1);
  const [note, setNote] = useState<string>(initialData.note || '');

  // Cycles history state
  const [cyclesList, setCyclesList] = useState<TestCycle[]>([]);
  const [activeCycleIndex, setActiveCycleIndex] = useState<number>(0);

  const [date, setDate] = useState<string>('10 June 2026');
  const [before, setBefore] = useState<TestMetrics>({});
  const [after, setAfter] = useState<TestMetrics>({});

  const [chartImage, setChartImage] = useState<string>(initialData.chartImage || '');
  const [beforeImages, setBeforeImages] = useState<string[]>(initialData.images?.before ? [...initialData.images.before] : []);
  const [afterImages, setAfterImages] = useState<string[]>(initialData.images?.after ? [...initialData.images.after] : []);

  const [autoCalc, setAutoCalc] = useState<boolean>(true);
  const [isProcessingImages, setIsProcessingImages] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const effectiveHeader = initialData?.headerConfig || headerConfig || {
        companyName: 'Lion Corporation (Thailand) Limited',
        reportTitle: 'RO4 Pass1 Membrane Cleaning Report',
        reportSubtitle: 'Service Report',
        jobDescription: 'Cleaning Membrane RO4 Pass1',
        servicePeriod: '10-16 June 2026',
      };

      setCompanyName(effectiveHeader.companyName || 'Lion Corporation (Thailand) Limited');
      setReportTitle(effectiveHeader.reportTitle || 'RO4 Pass1 Membrane Cleaning Report');
      setReportSubtitle(effectiveHeader.reportSubtitle || 'Service Report');
      setJobDescription(effectiveHeader.jobDescription || 'Cleaning Membrane RO4 Pass1');
      setServicePeriod(effectiveHeader.servicePeriod || '10-16 June 2026');

      setMembraneNo(initialData.membraneNo || 1);
      setSerialNumber(initialData.serialNumber || '');
      setBrandModel(initialData.brandModel || 'Filmtec / BW30 PRO-400');
      setStatus(initialData.status || 'PASS');
      setVessel(initialData.location?.vessel || 1);
      setPosition(initialData.location?.position || 1);
      setNote(initialData.note || (initialData.status === 'PASS' ? 'ผ่านการตรวจสอบตามรายงาน' : 'พบรอยแตกร้าวบริเวณหัว'));

      // Populate cycles history list
      const initialCycles = (initialData.cycles && initialData.cycles.length > 0)
        ? initialData.cycles.map(c => ({
            id: c.id,
            date: c.date || '10 June 2026',
            before: { ...c.before },
            after: { ...c.after }
          }))
        : [{ date: '10 June 2026', before: {}, after: {} }];

      setCyclesList(initialCycles);
      const activeIdx = initialCycles.length - 1;
      setActiveCycleIndex(activeIdx);

      const activeCyc = initialCycles[activeIdx];
      setDate(activeCyc.date || '10 June 2026');
      setBefore({ ...activeCyc.before });
      setAfter({ ...activeCyc.after });

      setChartImage(initialData.chartImage || '');
      setBeforeImages(initialData.images?.before ? [...initialData.images.before] : []);
      setAfterImages(initialData.images?.after ? [...initialData.images.after] : []);
    }
  }, [isOpen, initialData, headerConfig]);

  // Handle switching active cycle tab
  const handleSelectCycle = (targetIdx: number) => {
    if (targetIdx === activeCycleIndex) return;

    // Save current active cycle first
    setCyclesList(prev => {
      const next = [...prev];
      if (next[activeCycleIndex]) {
        next[activeCycleIndex] = { date, before, after };
      }
      return next;
    });

    setActiveCycleIndex(targetIdx);
    const targetCyc = cyclesList[targetIdx];
    if (targetCyc) {
      setDate(targetCyc.date || '');
      setBefore({ ...targetCyc.before });
      setAfter({ ...targetCyc.after });
    }
  };

  // Handle adding a new cycle date
  const handleAddCycle = () => {
    // 1. Sync current active cycle to list
    const currentList = [...cyclesList];
    if (currentList[activeCycleIndex]) {
      currentList[activeCycleIndex] = { date, before, after };
    }

    // 2. Prepare new cycle date
    const lastCycle = currentList[currentList.length - 1] || { before: {}, after: {} };
    const newDate = `15 August 2026`;

    const newCycle: TestCycle = {
      date: newDate,
      before: { ...lastCycle.after }, // Start before as last after metrics
      after: { ...lastCycle.after }
    };

    const updatedList = [...currentList, newCycle];

    // Keep up to 3 latest cycles for display/trend graph
    const finalCycles = updatedList.slice(-3);
    const newIdx = finalCycles.length - 1;

    setCyclesList(finalCycles);
    setActiveCycleIndex(newIdx);
    setDate(newCycle.date);
    setBefore(newCycle.before);
    setAfter(newCycle.after);
  };

  // Handle deleting a cycle
  const handleDeleteCycle = (indexToDelete: number) => {
    if (cyclesList.length <= 1) return;

    const currentList = [...cyclesList];
    if (currentList[activeCycleIndex]) {
      currentList[activeCycleIndex] = { date, before, after };
    }

    const updatedList = currentList.filter((_, idx) => idx !== indexToDelete);
    const newIdx = Math.min(activeCycleIndex, updatedList.length - 1);

    setCyclesList(updatedList);
    setActiveCycleIndex(newIdx);

    const activeCyc = updatedList[newIdx];
    if (activeCyc) {
      setDate(activeCyc.date || '');
      setBefore({ ...activeCyc.before });
      setAfter({ ...activeCyc.after });
    }
  };

  // Auto calculate recovery & rejection when inputs change if autoCalc is enabled
  useEffect(() => {
    if (!autoCalc) return;

    // Recalculate Before
    const bRec = calculateRecovery(before.inletFlow, before.concentrateFlow);
    const bRej = calculateRejection(before.permeateConductivity, before.rawWaterConductivity);

    // Recalculate After
    const aRec = calculateRecovery(after.inletFlow, after.concentrateFlow);
    const aRej = calculateRejection(after.permeateConductivity, after.rawWaterConductivity);

    let updatedBefore = { ...before };
    let updatedAfter = { ...after };
    let changed = false;

    if (bRec !== null && bRec !== before.recovery) { updatedBefore.recovery = bRec; changed = true; }
    if (bRej !== null && bRej !== before.rejection) { updatedBefore.rejection = bRej; changed = true; }
    if (aRec !== null && aRec !== after.recovery) { updatedAfter.recovery = aRec; changed = true; }
    if (aRej !== null && aRej !== after.rejection) { updatedAfter.rejection = aRej; changed = true; }

    if (changed) {
      setBefore(updatedBefore);
      setAfter(updatedAfter);
      setCyclesList(prev => {
        const next = [...prev];
        if (next[activeCycleIndex]) {
          next[activeCycleIndex] = {
            ...next[activeCycleIndex],
            before: updatedBefore,
            after: updatedAfter
          };
        }
        return next;
      });
    }
  }, [
    autoCalc, activeCycleIndex,
    before.inletFlow, before.concentrateFlow, before.permeateConductivity, before.rawWaterConductivity,
    after.inletFlow, after.concentrateFlow, after.permeateConductivity, after.rawWaterConductivity
  ]);

  if (!isOpen) return null;

  const compressAndReadImage = (file: File, maxWidth = 600, maxHeight = 600, quality = 0.6): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onerror = () => resolve('');
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result !== 'string') {
          resolve('');
          return;
        }

        const img = new Image();
        img.onerror = () => resolve(result); // Fallback to raw result if image parsing fails
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedDataUrl);
          } else {
            resolve(result);
          }
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleBeforeImageChange = async (index: number, file: File | null) => {
    if (!file) return;
    setIsProcessingImages(true);
    try {
      const base64 = await compressAndReadImage(file);
      if (base64) {
        setBeforeImages(prev => {
          const updated = [...prev];
          while (updated.length < 5) updated.push('');
          updated[index] = base64;
          return updated;
        });
      }
    } finally {
      setIsProcessingImages(false);
    }
  };

  const removeBeforeImage = (index: number) => {
    setBeforeImages(prev => {
      const updated = [...prev];
      updated[index] = '';
      return updated;
    });
  };

  const handleAfterImageChange = async (index: number, file: File | null) => {
    if (!file) return;
    setIsProcessingImages(true);
    try {
      const base64 = await compressAndReadImage(file);
      if (base64) {
        setAfterImages(prev => {
          const updated = [...prev];
          while (updated.length < 5) updated.push('');
          updated[index] = base64;
          return updated;
        });
      }
    } finally {
      setIsProcessingImages(false);
    }
  };

  const removeAfterImage = (index: number) => {
    setAfterImages(prev => {
      const updated = [...prev];
      updated[index] = '';
      return updated;
    });
  };

  const handleBatchUploadBefore = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessingImages(true);
    try {
      const fileList = Array.from(files).slice(0, 5);
      const compressedList = await Promise.all(fileList.map(f => compressAndReadImage(f)));
      setBeforeImages(prev => {
        const updated = [...prev];
        while (updated.length < 5) updated.push('');
        compressedList.forEach((b64, idx) => {
          if (b64) updated[idx] = b64;
        });
        return updated;
      });
    } finally {
      setIsProcessingImages(false);
    }
  };

  const handleBatchUploadAfter = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessingImages(true);
    try {
      const fileList = Array.from(files).slice(0, 5);
      const compressedList = await Promise.all(fileList.map(f => compressAndReadImage(f)));
      setAfterImages(prev => {
        const updated = [...prev];
        while (updated.length < 5) updated.push('');
        compressedList.forEach((b64, idx) => {
          if (b64) updated[idx] = b64;
        });
        return updated;
      });
    } finally {
      setIsProcessingImages(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure current active cycle is up to date in cyclesList
    const finalCyclesList = [...cyclesList];
    if (finalCyclesList[activeCycleIndex]) {
      finalCyclesList[activeCycleIndex] = { date, before, after };
    } else {
      finalCyclesList.push({ date, before, after });
    }

    // Filter valid non-empty cycles
    const validCycles = finalCyclesList.filter(c => c && c.date && c.date.trim().length > 0);
    // Keep up to 3 latest cycles as requested
    const cyclesToSave = validCycles.length > 0 ? validCycles.slice(-3) : [{ date, before, after }];

    const updatedHeaderConfig: HeaderConfig = {
      companyName: companyName.trim() || 'Lion Corporation (Thailand) Limited',
      reportTitle: reportTitle.trim() || 'RO4 Pass1 Membrane Cleaning Report',
      reportSubtitle: reportSubtitle.trim() || 'Service Report',
      jobDescription: jobDescription.trim() || 'Cleaning Membrane RO4 Pass1',
      servicePeriod: servicePeriod.trim() || '10-16 June 2026',
    };

    const savedMembrane: MembraneData = {
      membraneNo: Number(membraneNo),
      serialNumber: serialNumber.trim(),
      brandModel: brandModel.trim(),
      status,
      note: note.trim(),
      location: {
        vessel: vessel,
        position: position
      },
      headerConfig: updatedHeaderConfig,
      cycles: cyclesToSave,
      chartImage,
      images: {
        before: beforeImages.filter(Boolean),
        after: afterImages.filter(Boolean)
      }
    };

    onSave(savedMembrane, updatedHeaderConfig);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div>
            <h3 className="text-lg font-bold">
              {mode === 'new' ? '+ สร้าง Report หน้าใหม่ (New Membrane Report)' : `แก้ไขข้อมูล Membrane No. ${membraneNo}`}
            </h3>
            <p className="text-xs text-slate-300">
              {mode === 'new' ? 'กรอกข้อมูล รายละเอียดงาน และอัปโหลดรูปภาพสำหรับรายงานใหม่' : 'ปรับเปลี่ยนข้อมูล รายละเอียดงาน รูปภาพ และผลการทดสอบ'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs sm:text-sm">
          {/* Section 0: Header & Job Info */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-blue-200/80 pb-2">
              <h4 className="font-extrabold text-blue-900 uppercase tracking-wider text-xs flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>0. ข้อมูลหัวข้อรายงาน & รายละเอียดงาน (Header & Job Details)</span>
              </h4>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full border border-blue-200">
                อัปเดตหัวข้อและลูกค้า
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อลูกค้า / บริษัท (Customer Name) *
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="เช่น Lion Corporation (Thailand) Limited"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  รายละเอียดงาน (Job Description) *
                </label>
                <input
                  type="text"
                  required
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  placeholder="เช่น Cleaning Membrane RO4 Pass1"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  หัวข้อรายงานหลัก (Report Title) *
                </label>
                <input
                  type="text"
                  required
                  value={reportTitle}
                  onChange={e => setReportTitle(e.target.value)}
                  placeholder="เช่น RO4 Pass1 Membrane Cleaning Service Report"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ระยะเวลาการทำงาน (Service Period) *
                </label>
                <input
                  type="text"
                  required
                  value={servicePeriod}
                  onChange={e => setServicePeriod(e.target.value)}
                  placeholder="เช่น 10-16 June 2026"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 1: Membrane Basic Info */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-4">
            <h4 className="font-extrabold text-blue-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-2">
              1. ข้อมูลพื้นฐานไส้กรอง (Basic Information)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Membrane No. *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={membraneNo}
                  onChange={e => setMembraneNo(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Serial Number *</label>
                <input
                  type="text"
                  required
                  value={serialNumber}
                  onChange={e => setSerialNumber(e.target.value)}
                  placeholder="เช่น T9992297"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status (สถานะ) *</label>
                <select
                  value={status}
                  onChange={e => {
                    const newStatus = e.target.value as MembraneStatus;
                    setStatus(newStatus);
                    if (!note || note === 'ผ่านการตรวจสอบตามรายงาน' || note === 'พบรอยแตกร้าวบริเวณหัว (ตามหมายเหตุในรายงาน)') {
                      setNote(newStatus === 'PASS' ? 'ผ่านการตรวจสอบตามรายงาน' : 'พบรอยแตกร้าวบริเวณหัว (ตามหมายเหตุในรายงาน)');
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg font-bold focus:ring-2 focus:outline-none ${status === 'PASS' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-amber-50 border-amber-300 text-amber-800'}`}
                >
                  <option value="PASS">PASS (ผ่าน)</option>
                  <option value="REMARK">REMARK (ข้อสังเกต / มีตำหนิ)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brand / Model</label>
                <input
                  type="text"
                  value={brandModel}
                  onChange={e => setBrandModel(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Vessel Number</label>
                <input
                  type="number"
                  min="1"
                  value={vessel}
                  onChange={e => setVessel(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Position Number</label>
                <input
                  type="number"
                  min="1"
                  value={position}
                  onChange={e => setPosition(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">Remark / หมายเหตุ</label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="ระบุข้อสังเกต เช่น ผ่านการตรวจสอบ หรือ พบรอยแตกร้าว..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Test Cycle & Values History */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div>
                <h4 className="font-extrabold text-blue-900 uppercase tracking-wider text-xs flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>2. ผลการทดสอบและประวัติวันที่ล้าง (Test Cycles & History)</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  ระบบบันทึกประวัติการล้างสะสม 3 ครั้งล่าสุด เพื่อนำไปสร้างกราฟแนวโน้ม Performance และแสดงประวัติในรายงาน
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAutoCalc(!autoCalc)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${autoCalc ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-slate-200 text-slate-600'}`}
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>คำนวณ Recovery & Rejection อัตโนมัติ: {autoCalc ? 'เปิด' : 'ปิด'}</span>
                </button>
              </div>
            </div>

            {/* Cycle Tabs Selector */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-700">
                  ประวัติรอบการทดสอบ (สับเปลี่ยนเพื่อแก้ไข หรือกดเพิ่มรอบใหม่):
                </span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  ทั้งหมด {cyclesList.length} รอบ (บันทึก 3 ครั้งล่าสุด)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {cyclesList.map((cyc, idx) => {
                  const isActive = idx === activeCycleIndex;
                  const isLatest = idx === cyclesList.length - 1;

                  return (
                    <div key={idx} className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleSelectCycle(idx)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          isActive
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          รอบที่ {idx + 1}: {cyc.date || 'ระบุวันที่'}
                        </span>
                        {isLatest && (
                          <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold uppercase ${
                            isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                          }`}>
                            ล่าสุด
                          </span>
                        )}
                      </button>

                      {cyclesList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteCycle(idx)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                          title="ลบประวัติรอบนี้"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={handleAddCycle}
                  className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>+ เพิ่มรอบการล้าง/วันที่ใหม่</span>
                </button>
              </div>
            </div>

            {/* Active Cycle Input */}
            <div className="w-full sm:w-1/2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                วันที่ทดสอบรอบที่ {activeCycleIndex + 1} (Date) *
              </label>
              <input
                type="text"
                required
                value={date}
                onChange={e => {
                  const val = e.target.value;
                  setDate(val);
                  setCyclesList(prev => {
                    const next = [...prev];
                    if (next[activeCycleIndex]) {
                      next[activeCycleIndex] = { ...next[activeCycleIndex], date: val };
                    }
                    return next;
                  });
                }}
                placeholder="เช่น 10 June 2026 หรือ 15 August 2026"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold text-blue-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Test Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Before Cleaning */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-3.5 space-y-3">
                <h5 className="font-extrabold text-amber-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
                  ก่อนล้าง (Before Cleaning)
                </h5>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-600">Inlet Pressure (PSI)</label>
                    <input
                      type="number"
                      step="any"
                      value={before.inletPressure ?? ''}
                      onChange={e => setBefore({ ...before, inletPressure: e.target.value === '' ? null : Number(e.target.value) })}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600">Concentrate Pressure (PSI)</label>
                    <input
                      type="number"
                      step="any"
                      value={before.concentratePressure ?? ''}
                      onChange={e => setBefore({ ...before, concentratePressure: e.target.value === '' ? null : Number(e.target.value) })}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600">Inlet Flow (L/min)</label>
                    <input
                      type="number"
                      step="any"
                      value={before.inletFlow ?? ''}
                      onChange={e => setBefore({ ...before, inletFlow: e.target.value === '' ? null : Number(e.target.value) })}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600">Concentrate Flow (L/min)</label>
                    <input
                      type="number"
                      step="any"
                      value={before.concentrateFlow ?? ''}
                      onChange={e => setBefore({ ...before, concentrateFlow: e.target.value === '' ? null : Number(e.target.value) })}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600">Recovery (%)</label>
                    <input
                      type="number"
                      step="any"
                      value={before.recovery ?? ''}
                      onChange={e => setBefore({ ...before, recovery: e.target.value === '' ? null : Number(e.target.value) })}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg font-bold text-amber-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600">Permeate Conduct. (µS/cm)</label>
                    <input
                      type="number"
                      step="any"
                      value={before.permeateConductivity ?? ''}
                      onChange={e => setBefore({ ...before, permeateConductivity: e.target.value === '' ? null : Number(e.target.value) })}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600">Raw Water Conduct. (µS/cm)</label>
                    <input
                      type="number"
                      step="any"
                      value={before.rawWaterConductivity ?? ''}
                      onChange={e => setBefore({ ...before, rawWaterConductivity: e.target.value === '' ? null : Number(e.target.value) })}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600">Salt Rejection (%)</label>
                    <input
                      type="number"
                      step="any"
                      value={before.rejection ?? ''}
                      onChange={e => setBefore({ ...before, rejection: e.target.value === '' ? null : Number(e.target.value) })}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg font-bold text-amber-900"
                    />
                  </div>
                </div>
              </div>

              {/* After Cleaning */}
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-3.5 space-y-3">
                <h5 className="font-extrabold text-emerald-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                  หลังล้าง (After Cleaning)
                </h5>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-600">Inlet Pressure (PSI)</label>
                    <input
                      type="number"
                      step="any"
                      value={after.inletPressure ?? ''}
                      onChange={e => setAfter({ ...after, inletPressure: e.target.value === '' ? null : Number(e.target.value) })}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600">Concentrate Pressure (PSI)</label>
                    <input
                      type="number"
                      step="any"
                      value={after.concentratePressure ?? ''}
                      onChange={e => setAfter({ ...after, concentratePressure: e.target.value === '' ? null : Number(e.target.value) })}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600">Inlet Flow (L/min)</label>
                    <input
                      type="number"
                      step="any"
                      value={after.inletFlow ?? ''}
                      onChange={e => setAfter({ ...after, inletFlow: e.target.value === '' ? null : Number(e.target.value) })}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600">Concentrate Flow (L/min)</label>
                    <input
                      type="number"
                      step="any"
                      value={after.concentrateFlow ?? ''}
                      onChange={e => setAfter({ ...after, concentrateFlow: e.target.value === '' ? null : Number(e.target.value) })}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600">Recovery (%)</label>
                    <input
                      type="number"
                      step="any"
                      value={after.recovery ?? ''}
                      onChange={e => setAfter({ ...after, recovery: e.target.value === '' ? null : Number(e.target.value) })}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg font-bold text-emerald-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600">Permeate Conduct. (µS/cm)</label>
                    <input
                      type="number"
                      step="any"
                      value={after.permeateConductivity ?? ''}
                      onChange={e => setAfter({ ...after, permeateConductivity: e.target.value === '' ? null : Number(e.target.value) })}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600">Raw Water Conduct. (µS/cm)</label>
                    <input
                      type="number"
                      step="any"
                      value={after.rawWaterConductivity ?? ''}
                      onChange={e => setAfter({ ...after, rawWaterConductivity: e.target.value === '' ? null : Number(e.target.value) })}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600">Salt Rejection (%)</label>
                    <input
                      type="number"
                      step="any"
                      value={after.rejection ?? ''}
                      onChange={e => setAfter({ ...after, rejection: e.target.value === '' ? null : Number(e.target.value) })}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg font-bold text-emerald-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Photo Uploads */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-6">
            <h4 className="font-extrabold text-blue-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-2">
              3. อัปโหลดรูปภาพประกอบรายงาน (Photos Upload)
            </h4>

            {/* Folder / Batch Upload Tip Banner */}
            {isProcessingImages && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl p-3.5 text-xs flex items-center gap-2.5 animate-pulse">
                <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin shrink-0" />
                <span className="font-bold">กำลังประมวลผลและย่อขนาดรูปถ่ายอัตโนมัติ เพื่อให้พอดีกับฐานข้อมูลคลาวด์...</span>
              </div>
            )}

            <div className="bg-blue-50/90 border border-blue-200 text-blue-900 rounded-xl p-3.5 text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>วิธีเลือกรูปถ่ายจากโฟลเดอร์:</strong> ท่านสามารถกดปุ่ม <strong>"เลือกหลายรูปพร้อมกัน"</strong> เพื่อกดเลือกรูปทั้งหมดในโฟลเดอร์คอมพิวเตอร์ทีเดียว หรือคลิกที่ช่องแต่ละรูปเพื่อเปลี่ยนรายรูปได้ตามสะดวก
              </div>
            </div>

            {/* Before Photos (5 slots) */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <label className="font-bold text-amber-900">
                  รูปถ่ายก่อนล้าง (Before Cleaning Photos) - 5 รูป
                </label>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-all cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>เลือกหลายรูปพร้อมกันจากโฟลเดอร์</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={e => {
                      handleBatchUploadBefore(e.target.files);
                      e.target.value = '';
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const img = beforeImages[idx];
                  return (
                    <div key={`before-${idx}`} className="flex flex-col items-center gap-1.5 bg-white p-2 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-500">รูปที่ {idx + 1}</span>
                      {img ? (
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-slate-200">
                          <img src={img} alt={`Before ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeBeforeImage(idx)}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="w-full aspect-square border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-amber-400 hover:bg-amber-50/30 transition-all cursor-pointer">
                          <Upload className="w-4 h-4 mb-1 text-slate-400" />
                          <span className="text-[10px] font-semibold text-slate-500">เลือกไฟล์</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => {
                              handleBeforeImageChange(idx, e.target.files?.[0] || null);
                              e.target.value = '';
                            }}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* After Photos (5 slots) */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <label className="font-bold text-emerald-900">
                  รูปถ่ายหลังล้าง (After Cleaning Photos) - 5 รูป
                </label>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold transition-all cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>เลือกหลายรูปพร้อมกันจากโฟลเดอร์</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={e => {
                      handleBatchUploadAfter(e.target.files);
                      e.target.value = '';
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const img = afterImages[idx];
                  return (
                    <div key={`after-${idx}`} className="flex flex-col items-center gap-1.5 bg-white p-2 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-500">รูปที่ {idx + 1}</span>
                      {img ? (
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-slate-200">
                          <img src={img} alt={`After ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeAfterImage(idx)}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="w-full aspect-square border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer">
                          <Upload className="w-4 h-4 mb-1 text-slate-400" />
                          <span className="text-[10px] font-semibold text-slate-500">เลือกไฟล์</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => {
                              handleAfterImageChange(idx, e.target.files?.[0] || null);
                              e.target.value = '';
                            }}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-all cursor-pointer"
            >
              ยกเลิก (Close)
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{mode === 'new' ? 'บันทึกสร้าง Report ใหม่' : 'บันทึกการแก้ไข'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
