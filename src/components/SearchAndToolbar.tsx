import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, Layers, Edit, Trash2 } from 'lucide-react';
import { MembraneData, MembraneStatus } from '../types';

interface SearchAndToolbarProps {
  membranes: MembraneData[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  filterStatus: 'ALL' | MembraneStatus;
  onFilterChange: (status: 'ALL' | MembraneStatus) => void;
  onNewReport?: () => void;
  onEditCurrent: () => void;
  onDeleteCurrent: () => void;
}

export const SearchAndToolbar: React.FC<SearchAndToolbarProps> = ({
  membranes,
  currentIndex,
  onSelectIndex,
  filterStatus,
  onFilterChange,
  onEditCurrent,
  onDeleteCurrent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMsg, setSearchMsg] = useState<string | null>(null);

  const currentMembrane = membranes[currentIndex];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim().toUpperCase();
    if (!query) {
      setSearchMsg('โปรดป้อน Serial number เพื่อค้นหา');
      return;
    }

    const index = membranes.findIndex(m => m.serialNumber.toUpperCase() === query || `MEMBRANE NO. ${m.membraneNo}` === query || `${m.membraneNo}` === query);
    if (index !== -1) {
      onSelectIndex(index);
      setSearchMsg(`พบข้อมูล: Membrane No. ${membranes[index].membraneNo} (Serial: ${membranes[index].serialNumber})`);
    } else {
      setSearchMsg(`ไม่พบข้อมูลสำหรับ Serial: "${query}"`);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-lg shadow-slate-900/5 space-y-4">
      {/* Search & Navigation Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Serial Search Input */}
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setSearchMsg(null);
              }}
              placeholder="ค้นหาด้วย Serial number (เช่น T9992299)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono tracking-wide uppercase transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer shadow-sm shadow-blue-500/20"
          >
            ค้นหา
          </button>
        </form>

        {/* Previous & Next controls */}
        <div className="flex items-center justify-between sm:justify-end gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
          <button
            onClick={() => onSelectIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>ก่อนหน้า</span>
          </button>

          {/* Jump to Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">หน้า:</span>
            <select
              value={currentIndex}
              onChange={e => onSelectIndex(Number(e.target.value))}
              className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {membranes.map((m, idx) => (
                <option key={m.membraneNo || idx} value={idx}>
                  No. {m.membraneNo} ({m.serialNumber || 'No Serial'}) - [{m.status}]
                </option>
              ))}
            </select>
            <span className="text-xs font-bold text-slate-500">/ {membranes.length}</span>
          </div>

          <button
            onClick={() => onSelectIndex(currentIndex + 1)}
            disabled={currentIndex === membranes.length - 1}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <span>ถัดไป</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {searchMsg && (
        <div className={`text-xs font-medium px-3.5 py-2 rounded-lg ${searchMsg.includes('พบข้อมูล') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
          {searchMsg}
        </div>
      )}

      {/* Filter Tabs & Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100 pt-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => onFilterChange('ALL')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${filterStatus === 'ALL' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>ทั้งหมด ({membranes.length})</span>
          </button>

          <button
            onClick={() => onFilterChange('PASS')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${filterStatus === 'PASS' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>PASS ({membranes.filter(m => m.status === 'PASS').length})</span>
          </button>

          <button
            onClick={() => onFilterChange('REMARK')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${filterStatus === 'REMARK' ? 'bg-amber-600 text-white shadow-sm' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>REMARK ({membranes.filter(m => m.status === 'REMARK').length})</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onEditCurrent}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/20"
            title="แก้ไขข้อมูลไส้กรอง ผลการทดสอบ รูปภาพ และหัวข้อบริษัทในหน้าเดียว"
          >
            <Edit className="w-3.5 h-3.5 text-blue-100" />
            <span>แก้ไขรายงานหน้านี้ & หัวข้อ (No. {currentMembrane?.membraneNo})</span>
          </button>

          <button
            onClick={onDeleteCurrent}
            className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
            title="ลบรายงานหน้านี้"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
            <span>ลบหน้านี้</span>
          </button>
        </div>
      </div>
    </div>
  );
};
