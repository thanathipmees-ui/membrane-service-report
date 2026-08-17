import React, { useState, useEffect } from 'react';
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

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [filterStatus, setFilterStatus] = useState<'ALL' | MembraneStatus>('ALL');

  // Direct Cloud Fetch on Initial Mount (Consumes only ~15 reads total)
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const comps = await fetchCompaniesFromCloud();
        if (!isMounted) return;
        if (comps.length > 0) {
          setCompanies(comps);
          const targetCompId = comps.some((c) => c.id === activeCompanyId) ? activeCompanyId : comps[0].id;
          setActiveCompanyId(targetCompId);

          const ros = await fetchROSystemsFromCloud(targetCompId);
          if (!isMounted) return;
          if (ros.length > 0) {
            setRoSystems(ros);
            const targetRo = ros.some((r) => r.id === activeRoId)
              ? ros.find((r) => r.id === activeRoId)
              : ros.find((r) => r.id === 'lion-ro-4' || r.name.includes('RO4') || r.name.includes('RO 4')) || ros[0];
            const targetRoId = targetRo?.id || ros[0].id;
            setActiveRoId(targetRoId);

            const mems = await fetchMembranesFromCloud(targetCompId, targetRoId, targetRo?.name);
            if (!isMounted) return;
            setMembranes(mems);
          }
        }
        setIsCloudConnected(true);
      } catch (err) {
        console.warn('Initial cloud connection notice:', err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Select Company with targeted Cloud Fetch
  const handleSelectCompany = async (companyId: string) => {
    setActiveCompanyId(companyId);
    try {
      const ros = await fetchROSystemsFromCloud(companyId);
      setRoSystems(ros);
      const targetRo = ros.find((r) => r.id === 'lion-ro-4' || r.name.includes('RO4') || r.name.includes('RO 4')) || ros[0];
      const nextRoId = targetRo?.id || '';
      setActiveRoId(nextRoId);
      if (nextRoId) {
        const mems = await fetchMembranesFromCloud(companyId, nextRoId, targetRo?.name);
        setMembranes(mems);
      } else {
        setMembranes([]);
      }
      setCurrentIndex(0);
    } catch (err) {
      console.warn('Error fetching data for selected company:', err);
    }
  };

  // Handle Select RO System with targeted Cloud Fetch
  const handleSelectRO = async (roId: string) => {
    setActiveRoId(roId);
    const targetRo = roSystems.find((r) => r.id === roId);
    try {
      const mems = await fetchMembranesFromCloud(activeCompanyId, roId, targetRo?.name);
      setMembranes(mems);
      setCurrentIndex(0);
    } catch (err) {
      console.warn('Error fetching membranes for selected RO:', err);
    }
  };

  // Manual Cloud Sync Handler
  const handleSyncCloud = async () => {
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
      showToast('เชื่อมต่อและอัปเดตข้อมูลจากคลาวด์เรียบร้อย!');
    } catch (err) {
      console.warn('Sync cloud status:', err);
      showToast('เชื่อมต่อในโหมดแคช (ปลอดภัย)');
    } finally {
      setIsSyncing(false);
    }
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

  // Toast notification state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3500);
  };

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
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 font-bold text-xs sm:text-sm animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* Cloud Status Indicator */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className="font-semibold text-white">
              {isCloudConnected ? 'Cloud Database Connected (Firebase Firestore)' : 'Connecting to Cloud Database...'}
            </span>
            <span className="text-slate-400 hidden sm:inline">&middot; ดึงข้อมูลเฉพาะ RO ที่เปิดใช้งาน ประหยัดโควต้าสูงสุด (อ่านเพียง ~15 ครั้ง/การเปิดเว็บ)</span>
          </div>
          <button
            onClick={handleSyncCloud}
            disabled={isSyncing}
            className="text-cyan-300 hover:text-cyan-200 underline font-medium cursor-pointer ml-2"
          >
            {isSyncing ? 'กำลังรีเฟรชคลาวด์...' : 'รีเฟรชข้อมูลคลาวด์'}
          </button>
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
