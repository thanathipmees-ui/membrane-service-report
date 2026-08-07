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
import { ExportModal } from './components/ExportModal';
import {
  subscribeMembranes,
  saveMembraneToCloud,
  deleteMembraneFromCloud
} from './services/membraneService';

export default function App() {
  const [membranes, setMembranes] = useState<MembraneData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [filterStatus, setFilterStatus] = useState<'ALL' | MembraneStatus>('ALL');

  // Subscribe to real-time Firestore database updates
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeMembranes(
      (data) => {
        setMembranes(data);
        setIsLoading(false);
        setIsCloudConnected(true);
      },
      (err) => {
        console.error('Firestore sync error:', err);
        setIsLoading(false);
        setIsCloudConnected(false);
      }
    );

    return () => unsubscribe();
  }, []);

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
    const nextNo = membranes.length > 0 ? Math.max(...membranes.map((m) => Number(m.membraneNo) || 0)) + 1 : 1;
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

  const handleSaveReport = async (savedData: MembraneData, newHeaderConfig?: HeaderConfig) => {
    const finalHeader = newHeaderConfig || savedData.headerConfig || activeHeaderConfig;
    const membraneToSave: MembraneData = {
      ...savedData,
      headerConfig: finalHeader
    };

    try {
      await saveMembraneToCloud(membraneToSave);
      if (editorMode === 'new') {
        setFilterStatus('ALL');
        showToast(`บันทึกรายงาน Membrane No. ${membraneToSave.membraneNo} ลงคลาวด์สำเร็จ!`);
      } else {
        showToast(`อัปเดตรายงาน Membrane No. ${membraneToSave.membraneNo} บนคลาวด์สำเร็จ!`);
      }
    } catch (err) {
      console.error('Save to cloud failed:', err);
      showToast('เกิดข้อผิดพลาดในการบันทึกข้อมูลลงคลาวด์');
    }

    setIsEditorOpen(false);
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
    if (membranes.length <= 1) return;

    const targetNo = currentMembrane.membraneNo;
    try {
      await deleteMembraneFromCloud(targetNo);
      setIsDeleteModalOpen(false);
      showToast(`ลบรายงาน Membrane No. ${targetNo} บนคลาวด์เรียบร้อยแล้ว`);
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

      {/* Cloud Sync Status Indicator */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="font-semibold text-white">
            {isCloudConnected ? 'Cloud Database Connected (Firebase Firestore)' : 'Connecting to Cloud Database...'}
          </span>
          <span className="text-slate-400 hidden sm:inline">&middot; ข้อมูลอัปเดตและซิงค์อัตโนมัติทุกเครื่องแบบ Real-Time</span>
        </div>
      </div>

      {/* Main Header / Masthead */}
      <Masthead
        membranes={membranes}
        headerConfig={activeHeaderConfig}
        onNewReport={handleNewReportClick}
        onExportHtml={() => setIsExportModalOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6 relative z-20 space-y-6">
        {/* Job Info Metadata Bar */}
        <JobMetaBar totalCount={membranes.length} headerConfig={activeHeaderConfig} />

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
            <p className="font-bold text-sm">กำลังโหลดและซิงค์ข้อมูลจากฐานข้อมูลคลาวด์...</p>
          </div>
        ) : currentMembrane ? (
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

      {/* Export HTML Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        membranes={membranes}
        currentMembrane={currentMembrane}
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
