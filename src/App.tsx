import React, { useState, useEffect, useRef } from 'react';
import { initialMembranes } from './data/initialMembranes';
import { Company, ROSystem, MembraneData, MembraneStatus, HeaderConfig } from './types';
import { getMembraneHeader, defaultHeaderConfig } from './utils/calculations';
import { Masthead } from './components/Masthead';
import { JobMetaBar } from './components/JobMetaBar';
import { CompanyRoBar } from './components/CompanyRoBar';
import { SearchAndToolbar } from './components/SearchAndToolbar';
import { MembraneDetail } from './components/MembraneDetail';
import { ReportEditorModal } from './components/ReportEditorModal';
import { HeaderEditorModal } from './components/HeaderEditorModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { PhotoLightbox } from './components/PhotoLightbox';
import { ExportModal } from './components/ExportModal';
import { ImportModal } from './components/ImportModal';
import {
  getCachedCompanies,
  getCachedROSystems,
  getCachedMembranes,
  setCachedMembranes,
  fetchCompaniesFromCloud,
  fetchROSystemsFromCloud,
  fetchMembranesFromCloud,
  saveCompanyToCloud,
  deleteCompanyFromCloud,
  saveROSystemToCloud,
  deleteROSystemFromCloud,
  saveMembraneToCloud,
  saveBatchMembranesToCloud,
  deleteMembraneFromCloud,
  exportFullBackup,
  importFullBackup,
  resetCloudQuotaBlock,
  DEFAULT_COMPANY
} from './services/membraneService';

export default function App() {
  const initialComps = getCachedCompanies();
  const initialCompanyId = initialComps[0]?.id || 'lion-corp';
  const initialROs = getCachedROSystems(initialCompanyId);
  const initialRoId = initialROs[0]?.id || 'lion-ro-4';
  const initialMems = getCachedMembranes(initialCompanyId, initialRoId);

  const [companies, setCompanies] = useState<Company[]>(initialComps);
  const [activeCompanyId, setActiveCompanyId] = useState<string>(initialCompanyId);

  const [roSystems, setRoSystems] = useState<ROSystem[]>(initialROs);
  const [activeRoId, setActiveRoId] = useState<string>(initialRoId);

  const [membranes, setMembranes] = useState<MembraneData[]>(initialMems);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [filterStatus, setFilterStatus] = useState<'ALL' | MembraneStatus>('ALL');

  // Zero-Quota / Local-First Database Architecture
  // The app initializes and runs 100% locally from device storage with 0 cloud reads.
  // Cloud sync only runs when the user explicitly clicks the sync button.
  useEffect(() => {
    // Ensure all data caches are initialized in memory
    const comps = getCachedCompanies();
    setCompanies(comps);
    const cId = activeCompanyId || comps[0]?.id || 'lion-corp';
    setActiveCompanyId(cId);
    const ros = getCachedROSystems(cId);
    setRoSystems(ros);
    const rId = activeRoId || ros[0]?.id || 'lion-ro-4';
    setActiveRoId(rId);
    const targetRo = ros.find((r) => r.id === rId);
    const mems = getCachedMembranes(cId, rId, targetRo?.name);
    setMembranes(mems);
  }, []);

  // Handle Select Company - 100% Instant In-Memory / Local Cache (Zero Cloud Reads)
  const handleSelectCompany = (companyId: string) => {
    setActiveCompanyId(companyId);
    const ros = getCachedROSystems(companyId);
    setRoSystems(ros);
    const targetRo = ros.find((r) => r.id === 'lion-ro-4' || r.name.includes('RO4') || r.name.includes('RO 4')) || ros[0];
    const nextRoId = targetRo?.id || '';
    setActiveRoId(nextRoId);
    if (nextRoId) {
      const mems = getCachedMembranes(companyId, nextRoId, targetRo?.name);
      setMembranes(mems);
    } else {
      setMembranes([]);
    }
    setCurrentIndex(0);
  };

  // Handle Select RO System - 100% Instant In-Memory / Local Cache (Zero Cloud Reads)
  const handleSelectRO = (roId: string) => {
    setActiveRoId(roId);
    const targetRo = roSystems.find((r) => r.id === roId);
    const mems = getCachedMembranes(activeCompanyId, roId, targetRo?.name);
    setMembranes(mems);
    setCurrentIndex(0);
  };

  // Manual Cloud Sync Handler (only when user explicitly clicks refresh)
  const handleSyncCloud = async () => {
    resetCloudQuotaBlock();
    setIsSyncing(true);
    try {
      const comps = await fetchCompaniesFromCloud();
      if (comps.length > 0) {
        setCompanies(comps);
      }
      const targetCompId = comps.some((c) => c.id === activeCompanyId) ? activeCompanyId : (comps[0]?.id || 'lion-corp');
      setActiveCompanyId(targetCompId);

      const ros = await fetchROSystemsFromCloud(targetCompId);
      if (ros.length > 0) {
        setRoSystems(ros);
      }
      const targetRoId = ros.some((r) => r.id === activeRoId) ? activeRoId : (ros[0]?.id || '');
      setActiveRoId(targetRoId);

      if (targetRoId) {
        const targetRo = ros.find((r) => r.id === targetRoId);
        const mems = await fetchMembranesFromCloud(targetCompId, targetRoId, targetRo?.name, true);
        setMembranes(mems);
      }
      setIsCloudConnected(true);
      showToast('ซิงค์ข้อมูลกับคลาวด์เรียบร้อย!');
    } catch (err) {
      console.warn('Sync cloud status:', err);
      showToast('เชื่อมต่อในโหมดข้อมูลในเครื่อง (ปลอดภัย)');
    } finally {
      setIsSyncing(false);
    }
  };

  // Backup All Data to JSON file
  const handleExportBackup = () => {
    try {
      const backup = exportFullBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `ro_membrane_backup_${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('ดาวน์โหลดไฟล์สำรองข้อมูล (JSON) สำเร็จ!');
    } catch (e) {
      console.error(e);
      showToast('เกิดข้อผิดพลาดในการสำรองข้อมูล');
    }
  };

  // Restore All Data from JSON file
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const content = evt.target?.result as string;
        const parsed = JSON.parse(content);
        const ok = importFullBackup(parsed);
        if (ok) {
          const comps = getCachedCompanies();
          setCompanies(comps);
          const cId = comps[0]?.id || 'lion-corp';
          setActiveCompanyId(cId);
          const ros = getCachedROSystems(cId);
          setRoSystems(ros);
          const rId = ros[0]?.id || 'lion-ro-4';
          setActiveRoId(rId);
          const mems = getCachedMembranes(cId, rId);
          setMembranes(mems);
          setCurrentIndex(0);
          showToast('กู้คืนข้อมูลทั้งหมดจากไฟล์สำรองสำเร็จ!');
        } else {
          showToast('รูปแบบไฟล์สำรองไม่ถูกต้อง');
        }
      } catch (err) {
        console.error(err);
        showToast('ไม่สามารถอ่านไฟล์สำรองได้');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Filtered dataset based on status pill
  const filteredMembranes = membranes.filter((m) => {
    if (filterStatus === 'ALL') return true;
    return m.status === filterStatus;
  });

  // Clamp current index within valid bounds
  useEffect(() => {
    if (currentIndex >= filteredMembranes.length && filteredMembranes.length > 0) {
      setCurrentIndex(Math.max(0, filteredMembranes.length - 1));
    }
  }, [filteredMembranes.length, currentIndex]);

  // Modal editor state
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editorMode, setEditorMode] = useState<'new' | 'edit'>('new');
  const [editingMembrane, setEditingMembrane] = useState<MembraneData>(initialMembranes[0]);

  // Header editor modal state
  const [isHeaderEditorOpen, setIsHeaderEditorOpen] = useState<boolean>(false);

  // Delete confirm modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  // Export HTML modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Import PDF/Excel modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);

  // Photo Lightbox state
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxCaption, setLightboxCaption] = useState<string | null>(null);

  const activeCompany = companies.find((c) => c.id === activeCompanyId) || companies[0];
  const activeRo = roSystems.find((r) => r.id === activeRoId) || roSystems[0];

  const currentMembrane = filteredMembranes[currentIndex] || membranes[0];
  const activeHeaderConfig = currentMembrane
    ? getMembraneHeader(currentMembrane)
    : activeRo?.headerConfig || {
        ...defaultHeaderConfig,
        companyName: activeCompany?.name || defaultHeaderConfig.companyName,
        jobDescription: activeRo ? `Cleaning Membrane ${activeRo.name}` : defaultHeaderConfig.jobDescription,
        reportTitle: activeRo ? `${activeRo.name} Membrane Cleaning Report` : defaultHeaderConfig.reportTitle
      };

  // Company Operations
  const handleAddCompany = async (name: string) => {
    const newCompanyId = `comp-${Date.now()}`;
    const newComp: Company = {
      id: newCompanyId,
      name,
      createdAt: new Date().toISOString()
    };

    // Also create initial RO1 for new company
    const initialRoId = `ro-${Date.now()}`;
    const initialRo: ROSystem = {
      id: initialRoId,
      companyId: newCompanyId,
      name: 'RO1 Pass 1',
      headerConfig: {
        ...defaultHeaderConfig,
        companyName: name,
        jobDescription: 'Cleaning Membrane RO1 Pass 1',
        reportTitle: 'RO1 Pass 1 Membrane Cleaning Report'
      },
      createdAt: new Date().toISOString()
    };

    try {
      setCompanies((prev) => [...prev, newComp]);
      setRoSystems([initialRo]);
      setActiveCompanyId(newCompanyId);
      setActiveRoId(initialRoId);
      await saveCompanyToCloud(newComp);
      await saveROSystemToCloud(initialRo);
      showToast(`สร้างบริษัท "${name}" สำเร็จ!`);
    } catch (err) {
      console.error('Error adding company:', err);
      showToast('เกิดข้อผิดพลาดในการสร้างบริษัท');
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (companies.length <= 1) {
      showToast('ไม่สามารถลบบริษัทสุดท้ายได้');
      return;
    }
    try {
      const remaining = companies.filter((c) => c.id !== companyId);
      setCompanies(remaining);
      if (remaining.length > 0) {
        setActiveCompanyId(remaining[0].id);
      }
      await deleteCompanyFromCloud(companyId);
      showToast('ลบบริษัทเรียบร้อยแล้ว');
    } catch (err) {
      console.error('Error deleting company:', err);
      showToast('เกิดข้อผิดพลาดในการลบบริษัท');
    }
  };

  // RO Operations
  const handleAddRO = async (name: string) => {
    if (!activeCompanyId) return;
    const newRoId = `ro-${Date.now()}`;
    const newRo: ROSystem = {
      id: newRoId,
      companyId: activeCompanyId,
      name,
      headerConfig: {
        ...defaultHeaderConfig,
        companyName: activeCompany?.name || defaultHeaderConfig.companyName,
        jobDescription: `Cleaning Membrane ${name}`,
        reportTitle: `${name} Membrane Cleaning Report`
      },
      createdAt: new Date().toISOString()
    };

    try {
      setRoSystems((prev) => [...prev, newRo]);
      setActiveRoId(newRoId);
      await saveROSystemToCloud(newRo);
      showToast(`สร้างระบบ RO "${name}" สำเร็จ!`);
    } catch (err) {
      console.error('Error adding RO:', err);
      showToast('เกิดข้อผิดพลาดในการสร้างระบบ RO');
    }
  };

  const handleDeleteRO = async (roId: string) => {
    if (roSystems.length <= 1) {
      showToast('ไม่สามารถลบระบบ RO สุดท้ายได้');
      return;
    }
    try {
      const remaining = roSystems.filter((r) => r.id !== roId);
      setRoSystems(remaining);
      if (remaining.length > 0) {
        setActiveRoId(remaining[0].id);
      }
      await deleteROSystemFromCloud(roId);
      showToast('ลบระบบ RO เรียบร้อยแล้ว');
    } catch (err) {
      console.error('Error deleting RO:', err);
      showToast('เกิดข้อผิดพลาดในการลบระบบ RO');
    }
  };

  // New Membrane Report
  const handleNewReportClick = () => {
    // Membranes inside an RO system start from Membrane No. 1
    const nextNo =
      membranes.length > 0
        ? Math.max(...membranes.map((m) => Number(m.membraneNo) || 0)) + 1
        : 1;

    const baseHeader: HeaderConfig = {
      ...defaultHeaderConfig,
      companyName: activeCompany?.name || defaultHeaderConfig.companyName,
      jobDescription: activeRo ? `Cleaning Membrane ${activeRo.name}` : defaultHeaderConfig.jobDescription,
      reportTitle: activeRo ? `${activeRo.name} Membrane Cleaning Report` : defaultHeaderConfig.reportTitle
    };

    const newBlankMembrane: MembraneData = {
      companyId: activeCompanyId,
      roId: activeRoId,
      membraneNo: nextNo,
      serialNumber: '',
      brandModel: 'Filmtec / BW30 PRO-400',
      status: 'PASS',
      note: 'ผ่านการตรวจสอบตามรายงาน',
      location: { vessel: 1, position: 1 },
      headerConfig: baseHeader,
      cycles: [
        {
          date: '10 June 2026',
          before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 25, rawWaterConductivity: 250, rejection: 90 },
          after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 12, rawWaterConductivity: 250, rejection: 95.2 }
        }
      ],
      chartImage: '',
      images: {
        before: [],
        after: []
      }
    };

    setEditingMembrane(newBlankMembrane);
    setEditorMode('new');
    setIsEditorOpen(true);
  };

  const handleEditCurrentClick = () => {
    if (!currentMembrane) return;
    setEditingMembrane(currentMembrane);
    setEditorMode('edit');
    setIsEditorOpen(true);
  };

  const handleSaveReport = async (savedData: MembraneData, newHeaderConfig?: HeaderConfig) => {
    const finalHeader = newHeaderConfig || savedData.headerConfig || activeHeaderConfig;
    const membraneToSave: MembraneData = {
      ...savedData,
      companyId: activeCompanyId,
      roId: activeRoId,
      headerConfig: finalHeader
    };

    try {
      setMembranes((prev) => {
        const idx = prev.findIndex(
          (m) =>
            m.id === membraneToSave.id ||
            (m.companyId === membraneToSave.companyId &&
              m.roId === membraneToSave.roId &&
              m.membraneNo === membraneToSave.membraneNo)
        );
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = membraneToSave;
          return updated;
        }
        return [...prev, membraneToSave];
      });
      await saveMembraneToCloud(membraneToSave);
      if (editorMode === 'new') {
        setFilterStatus('ALL');
        showToast(`บันทึกรายงาน Membrane No. ${membraneToSave.membraneNo} (${activeRo?.name}) สำเร็จ!`);
      } else {
        showToast(`อัปเดตรายงาน Membrane No. ${membraneToSave.membraneNo} สำเร็จ!`);
      }
    } catch (err) {
      console.error('Save to cloud failed:', err);
      showToast('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }

    setIsEditorOpen(false);
  };

  const handleBatchImport = async (
    targetCompanyName: string,
    targetRoName: string,
    importedMembranes: MembraneData[]
  ) => {
    let companyId = companies.find(
      (c) => c.name.trim().toLowerCase() === targetCompanyName.trim().toLowerCase()
    )?.id;

    if (!companyId) {
      companyId = `comp-${Date.now()}`;
      const newCompany: Company = {
        id: companyId,
        name: targetCompanyName,
        createdAt: new Date().toISOString()
      };
      await saveCompanyToCloud(newCompany);
    }

    let roId = roSystems.find(
      (r) => r.companyId === companyId && r.name.trim().toLowerCase() === targetRoName.trim().toLowerCase()
    )?.id;

    if (!roId) {
      roId = `ro-${Date.now()}`;
      const newRo: ROSystem = {
        id: roId,
        companyId,
        name: targetRoName,
        headerConfig: {
          ...defaultHeaderConfig,
          companyName: targetCompanyName,
          jobDescription: `Cleaning Membrane ${targetRoName}`,
          reportTitle: `${targetRoName} Membrane Cleaning Report`
        },
        createdAt: new Date().toISOString()
      };
      await saveROSystemToCloud(newRo);
    }

    const headerConfig: HeaderConfig = {
      ...defaultHeaderConfig,
      companyName: targetCompanyName,
      jobDescription: `Cleaning Membrane ${targetRoName}`,
      reportTitle: `${targetRoName} Membrane Cleaning Report`
    };

    const preparedBatch = importedMembranes.map((m) => ({
      ...m,
      companyId,
      roId,
      headerConfig
    }));

    await saveBatchMembranesToCloud(preparedBatch);

    setActiveCompanyId(companyId);
    setActiveRoId(roId);
    setFilterStatus('ALL');
    setCurrentIndex(0);
    showToast(`นำเข้าข้อมูล ${importedMembranes.length} ท่อนสำหรับ "${targetCompanyName} > ${targetRoName}" สำเร็จ!`);
  };

  const handleSaveHeaderConfig = async (newConfig: HeaderConfig) => {
    if (currentMembrane) {
      const updated = { ...currentMembrane, headerConfig: newConfig };
      try {
        await saveMembraneToCloud(updated);
        showToast('อัปเดตข้อมูลหัวข้อลงคลาวด์เรียบร้อยแล้ว!');
      } catch (err) {
        console.error('Header save failed:', err);
      }
    }
    setIsHeaderEditorOpen(false);
  };

  const handleDeleteCurrentClick = () => {
    if (!currentMembrane) return;
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!currentMembrane) return;

    const targetId = currentMembrane.id || `${activeCompanyId}_${activeRoId}_${currentMembrane.membraneNo}`;
    const targetNo = currentMembrane.membraneNo;
    try {
      setMembranes((prev) => prev.filter((m) => m.id !== targetId && m.membraneNo !== targetNo));
      setIsDeleteModalOpen(false);
      await deleteMembraneFromCloud(targetId, activeCompanyId, activeRoId, targetNo);
      showToast(`ลบรายงาน Membrane No. ${targetNo} เรียบร้อยแล้ว`);
    } catch (err) {
      console.error('Delete from cloud failed:', err);
      showToast('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        isEditorOpen ||
        isHeaderEditorOpen ||
        isDeleteModalOpen ||
        lightboxSrc ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => Math.min(filteredMembranes.length - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredMembranes.length, isEditorOpen, isHeaderEditorOpen, isDeleteModalOpen, lightboxSrc]);

  return (
    <div className="min-h-screen bg-[#edf3f8] text-slate-900 font-sans pb-16">
      {/* Toast Banner */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700/80 font-bold text-xs sm:text-sm backdrop-blur-md transition-all duration-300 transform translate-y-0">
          {toastMsg}
        </div>
      )}

      {/* Hidden File Input for JSON Backup Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportBackup}
        accept=".json,application/json"
        className="hidden"
      />

      {/* Cloud & Local Storage Safe Status Indicator */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between max-w-7xl mx-auto w-full gap-2">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className="font-semibold text-white">
              {isCloudConnected ? 'ระบบเก็บข้อมูลอัจฉริยะ (Local Cache + Cloud Sync)' : 'ระบบทำงานด้วยฐานข้อมูลในเครื่อง (100% Safe Offline Mode)'}
            </span>
            <span className="text-slate-400 hidden md:inline">&middot; ข้อมูลทั้งหมดถูกบันทึกลงในเครื่องตลอดเวลา ข้อมูลไม่หายแน่นอน สลับ RO ได้ทันที</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportBackup}
              title="ดาวน์โหลดไฟล์สำรองข้อมูลทั้งหมดเป็น JSON เก็บไว้ในเครื่อง"
              className="text-emerald-300 hover:text-emerald-200 font-medium cursor-pointer flex items-center gap-1 transition-colors"
            >
              <span>💾 สำรองข้อมูล (Backup JSON)</span>
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => fileInputRef.current?.click()}
              title="กู้คืนข้อมูลทั้งหมดจากไฟล์ Backup JSON"
              className="text-amber-300 hover:text-amber-200 font-medium cursor-pointer flex items-center gap-1 transition-colors"
            >
              <span>📂 กู้คืนข้อมูล (Restore JSON)</span>
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={handleSyncCloud}
              disabled={isSyncing}
              className="text-cyan-300 hover:text-cyan-200 underline font-medium cursor-pointer"
            >
              {isSyncing ? 'กำลังซิงค์...' : 'รีเฟรชคลาวด์'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header / Masthead */}
      <Masthead
        membranes={membranes}
        headerConfig={activeHeaderConfig}
        companyName={activeCompany?.name}
        roName={activeRo?.name}
        isCloudConnected={isCloudConnected}
        isSyncing={isSyncing}
        onSyncCloud={handleSyncCloud}
        onNewReport={handleNewReportClick}
        onImportClick={() => setIsImportModalOpen(true)}
        onExportHtml={() => setIsExportModalOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6 relative z-20 space-y-6">
        {/* Company & RO Selector Navigation Bar */}
        <CompanyRoBar
          companies={companies}
          activeCompanyId={activeCompanyId}
          onSelectCompany={handleSelectCompany}
          onAddCompany={handleAddCompany}
          onDeleteCompany={handleDeleteCompany}
          roSystems={roSystems}
          activeRoId={activeRoId}
          onSelectRO={handleSelectRO}
          onAddRO={handleAddRO}
          onDeleteRO={handleDeleteRO}
        />

        {/* Job Info Metadata Bar */}
        <JobMetaBar
          totalCount={membranes.length}
          headerConfig={activeHeaderConfig}
          companyName={activeCompany?.name}
          roName={activeRo?.name}
        />

        {/* Search & Navigation Toolbar */}
        <SearchAndToolbar
          membranes={filteredMembranes}
          currentIndex={currentIndex}
          onSelectIndex={setCurrentIndex}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          onEditCurrent={handleEditCurrentClick}
          onDeleteCurrent={handleDeleteCurrentClick}
        />

        {/* Membrane Detail Card View */}
        {isLoading ? (
          <div className="bg-white rounded-3xl p-16 text-center text-slate-600 border border-slate-200 shadow-sm space-y-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-bold text-sm">กำลังโหลดข้อมูลและซิงค์ {activeCompany?.name} &gt; {activeRo?.name} จากคลาวด์...</p>
          </div>
        ) : currentMembrane ? (
          <MembraneDetail
            key={`membrane-${activeCompanyId}-${activeRoId}-${currentMembrane.membraneNo}`}
            membrane={currentMembrane}
            onOpenPhoto={(src, label) => {
              setLightboxSrc(src);
              setLightboxCaption(label);
            }}
          />
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center text-slate-500 border border-slate-200 shadow-sm space-y-4">
            <p className="font-bold text-base text-slate-700">
              ยังไม่มีรายงานไส้กรอง Membrane ในระบบ {activeRo?.name || 'RO'} ของ {activeCompany?.name}
            </p>
            <p className="text-xs text-slate-400">
              แต่ละระบบ RO จะเริ่มนับจาก Membrane No. 1 คุณสามารถกดปุ่มสร้างรายงานใหม่ด้านล่างเพื่อเริ่มบันทึกข้อมูล
            </p>
            <button
              onClick={handleNewReportClick}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md cursor-pointer"
            >
              + สร้าง Membrane No. 1 สำหรับ {activeRo?.name || 'ระบบ RO นี้'}
            </button>
          </div>
        )}
      </main>

      {/* Report Editor Modal */}
      <ReportEditorModal
        isOpen={isEditorOpen}
        mode={editorMode}
        initialData={editingMembrane}
        headerConfig={activeHeaderConfig}
        onSave={handleSaveReport}
        onClose={() => setIsEditorOpen(false)}
      />

      {/* Header Editor Modal */}
      <HeaderEditorModal
        isOpen={isHeaderEditorOpen}
        headerConfig={activeHeaderConfig}
        onSave={handleSaveHeaderConfig}
        onClose={() => setIsHeaderEditorOpen(false)}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        membrane={currentMembrane}
        totalCount={membranes.length}
        onConfirm={handleConfirmDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />

      {/* Export HTML Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        membranes={membranes}
        currentMembrane={currentMembrane}
      />

      {/* Import PDF/Excel Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        companies={companies}
        roSystems={roSystems}
        onImportComplete={handleBatchImport}
      />

      {/* Photo Lightbox */}
      <PhotoLightbox
        src={lightboxSrc}
        caption={lightboxCaption}
        onClose={() => {
          setLightboxSrc(null);
          setLightboxCaption(null);
        }}
      />

      <footer className="max-w-7xl mx-auto px-4 sm:px-8 mt-12 text-center text-xs text-slate-400 font-medium">
        {activeCompany?.name} &middot; {activeRo?.name || 'RO Service Report'}
      </footer>
    </div>
  );
}
