import React, { useState, useEffect } from 'react';
import { initialMembranes } from './data/initialMembranes';
import { MembraneData, MembraneStatus, HeaderConfig } from './types';
import { getMembraneHeader, defaultHeaderConfig } from './utils/calculations';
import { Masthead } from './components/Masthead';
import { JobMetaBar } from './components/JobMetaBar';
import { SearchAndToolbar } from './components/SearchAndToolbar';
import { MembraneDetail } from './components/MembraneDetail';
import { ReportEditorModal } from './components/ReportEditorModal';
import { HeaderEditorModal } from './components/HeaderEditorModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { PhotoLightbox } from './components/PhotoLightbox';

const LOCAL_STORAGE_KEY = 'lion_ro4_pass1_membranes_v2';
const HEADER_CONFIG_KEY = 'lion_ro4_header_config_v1';

export default function App() {
  const [membranes, setMembranes] = useState<MembraneData[]>(() => {
    let loaded = initialMembranes;
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loaded = parsed;
        }
      }
    } catch (err) {
      console.error('Error loading stored membranes:', err);
    }
    // Deep copy headerConfig for every membrane so each report's company name & job info is completely independent
    return loaded.map(m => ({
      ...m,
      headerConfig: m.headerConfig ? { ...m.headerConfig } : { ...defaultHeaderConfig }
    }));
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [filterStatus, setFilterStatus] = useState<'ALL' | MembraneStatus>('ALL');

  // Filtered dataset based on status pill
  const filteredMembranes = membranes.filter(m => {
    if (filterStatus === 'ALL') return true;
    return m.status === filterStatus;
  });

  // Clamp current index within valid bounds
  useEffect(() => {
    if (currentIndex >= filteredMembranes.length) {
      setCurrentIndex(Math.max(0, filteredMembranes.length - 1));
    }
  }, [filteredMembranes.length, currentIndex]);

  // Persist membranes to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(membranes));
    } catch (err) {
      console.error('Error saving membranes to localStorage:', err);
    }
  }, [membranes]);

  // Modal editor state
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editorMode, setEditorMode] = useState<'new' | 'edit'>('new');
  const [editingMembrane, setEditingMembrane] = useState<MembraneData>(initialMembranes[0]);

  // Header editor modal state
  const [isHeaderEditorOpen, setIsHeaderEditorOpen] = useState<boolean>(false);

  // Delete confirm modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

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

  const currentMembrane = filteredMembranes[currentIndex] || membranes[0];
  const activeHeaderConfig = getMembraneHeader(currentMembrane);

  const handleNewReportClick = () => {
    const nextNo = membranes.length > 0 ? Math.max(...membranes.map(m => Number(m.membraneNo) || 0)) + 1 : 1;
    const baseHeader = activeHeaderConfig ? { ...activeHeaderConfig } : { ...defaultHeaderConfig };

    const newBlankMembrane: MembraneData = {
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

  const handleSaveReport = (savedData: MembraneData, newHeaderConfig?: HeaderConfig) => {
    const finalHeader = newHeaderConfig || savedData.headerConfig || activeHeaderConfig;
    const membraneToSave: MembraneData = {
      ...savedData,
      headerConfig: finalHeader,
    };

    if (editorMode === 'new') {
      const updatedList = [...membranes, membraneToSave];
      setMembranes(updatedList);
      // Switch filter to ALL and navigate to the newly added membrane
      setFilterStatus('ALL');
      const newIdx = updatedList.length - 1;
      setCurrentIndex(newIdx);
      showToast(`สร้างรายงาน Membrane No. ${membraneToSave.membraneNo} สำเร็จเรียบร้อย!`);
    } else {
      const updatedList = membranes.map(m => m.membraneNo === membraneToSave.membraneNo ? membraneToSave : m);
      setMembranes(updatedList);
      showToast(`บันทึกการแก้ไข Membrane No. ${membraneToSave.membraneNo} สำเร็จ!`);
    }

    setIsEditorOpen(false);
  };

  const handleSaveHeaderConfig = (newConfig: HeaderConfig) => {
    if (currentMembrane) {
      const updated = { ...currentMembrane, headerConfig: newConfig };
      setMembranes(prev => prev.map(m => m.membraneNo === currentMembrane.membraneNo ? updated : m));
    }
    setIsHeaderEditorOpen(false);
    showToast('อัปเดตข้อมูลหัวข้อสำหรับรายงานนี้เรียบร้อยแล้ว!');
  };

  const handleDeleteCurrentClick = () => {
    if (!currentMembrane) return;
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!currentMembrane) return;
    if (membranes.length <= 1) return;

    const targetNo = currentMembrane.membraneNo;
    const updatedList = membranes.filter(m => m !== currentMembrane && m.membraneNo !== targetNo);
    setMembranes(updatedList);

    const remainingFiltered = filteredMembranes.filter(m => m !== currentMembrane && m.membraneNo !== targetNo);
    if (remainingFiltered.length === 0) {
      setFilterStatus('ALL');
      setCurrentIndex(0);
    } else {
      setCurrentIndex(prev => Math.max(0, Math.min(prev, remainingFiltered.length - 1)));
    }

    setIsDeleteModalOpen(false);
    showToast(`ลบรายงาน Membrane No. ${targetNo} เรียบร้อยแล้ว`);
  };

  const handleResetData = () => {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นรายงานเริ่มต้น 30 รายการใช่หรือไม่?')) {
      setMembranes(initialMembranes.map(m => ({ ...m, headerConfig: { ...defaultHeaderConfig } })));
      setFilterStatus('ALL');
      setCurrentIndex(0);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem(HEADER_CONFIG_KEY);
      showToast('รีเซ็ตข้อมูลกลับเป็นเริ่มต้นแล้ว');
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing inside an input/textarea or modal is open
      if (isEditorOpen || isHeaderEditorOpen || isDeleteModalOpen || lightboxSrc || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex(prev => Math.min(filteredMembranes.length - 1, prev + 1));
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

      {/* Main Header / Masthead */}
      <Masthead
        membranes={membranes}
        headerConfig={activeHeaderConfig}
        onNewReport={handleNewReportClick}
        onEditHeader={() => setIsHeaderEditorOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6 relative z-20 space-y-6">
        {/* Job Info Metadata Bar */}
        <JobMetaBar
          totalCount={membranes.length}
          headerConfig={activeHeaderConfig}
          onEditHeader={() => setIsHeaderEditorOpen(true)}
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
        {currentMembrane ? (
          <MembraneDetail
            key={`membrane-${currentMembrane.membraneNo}`}
            membrane={currentMembrane}
            onOpenPhoto={(src, label) => {
              setLightboxSrc(src);
              setLightboxCaption(label);
            }}
          />
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200 shadow-sm">
            ไม่พบรายงานในหมวดหมู่นี้
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
        {activeHeaderConfig?.companyName} &middot; {activeHeaderConfig?.reportTitle}
      </footer>
    </div>
  );
}
