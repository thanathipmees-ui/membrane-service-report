import React, { useState } from 'react';
import { Company, ROSystem } from '../types';
import { Building2, Layers, Plus, Trash2, Check, ChevronDown, AlertTriangle, X } from 'lucide-react';

interface CompanyRoBarProps {
  companies: Company[];
  activeCompanyId: string;
  onSelectCompany: (companyId: string) => void;
  onAddCompany: (name: string) => void;
  onDeleteCompany: (companyId: string) => void;

  roSystems: ROSystem[];
  activeRoId: string;
  onSelectRO: (roId: string) => void;
  onAddRO: (name: string) => void;
  onDeleteRO: (roId: string) => void;
}

export const CompanyRoBar: React.FC<CompanyRoBarProps> = ({
  companies,
  activeCompanyId,
  onSelectCompany,
  onAddCompany,
  onDeleteCompany,
  roSystems,
  activeRoId,
  onSelectRO,
  onAddRO,
  onDeleteRO,
}) => {
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');

  const [isAddRoModalOpen, setIsAddRoModalOpen] = useState(false);
  const [newRoName, setNewRoName] = useState('');

  const [isConfirmDeleteCompany, setIsConfirmDeleteCompany] = useState(false);
  const [isConfirmDeleteRo, setIsConfirmDeleteRo] = useState(false);

  const activeCompany = companies.find((c) => c.id === activeCompanyId) || companies[0];
  const activeRo = roSystems.find((r) => r.id === activeRoId) || roSystems[0];

  const handleAddCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;
    onAddCompany(newCompanyName.trim());
    setNewCompanyName('');
    setIsAddCompanyModalOpen(false);
  };

  const handleAddRoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoName.trim()) return;
    onAddRO(newRoName.trim());
    setNewRoName('');
    setIsAddRoModalOpen(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-4 sm:p-5 space-y-4">
      {/* Top Row: Company Selector & Management */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        {/* Active Company Selector */}
        <div className="flex items-center gap-3 relative flex-1">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              บริษัท / Customer
            </span>
            <div className="relative inline-block w-full max-w-lg mt-0.5">
              <button
                onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                className="w-full flex items-center justify-between gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left font-bold text-slate-900 text-sm sm:text-base transition-all cursor-pointer"
              >
                <span className="truncate">{activeCompany?.name || 'เลือกบริษัท'}</span>
                <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
              </button>

              {/* Company Dropdown Menu */}
              {isCompanyDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-full min-w-[280px] bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 max-h-60 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    เลือกบริษัทที่ต้องการดูรายงาน
                  </div>
                  {companies.map((comp) => (
                    <button
                      key={comp.id}
                      onClick={() => {
                        onSelectCompany(comp.id);
                        setIsCompanyDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-xs sm:text-sm font-bold text-left transition-colors cursor-pointer ${
                        comp.id === activeCompanyId
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{comp.name}</span>
                      {comp.id === activeCompanyId && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Company Actions: Add & Delete */}
        <div className="flex items-center gap-2 self-end md:self-center">
          <button
            onClick={() => setIsAddCompanyModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ เพิ่มบริษัท</span>
          </button>

          {companies.length > 1 && (
            <button
              onClick={() => setIsConfirmDeleteCompany(true)}
              className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer"
              title="ลบบริษัทนี้"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ลบบริษัท</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: RO Systems Tabs & Management */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* RO Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 flex-1">
          <div className="p-2 rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-100 shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 shrink-0">
            ระบบ RO:
          </span>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {roSystems.map((ro) => {
              const isActive = ro.id === activeRoId;
              return (
                <button
                  key={ro.id}
                  onClick={() => onSelectRO(ro.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span>{ro.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RO Actions: Add & Delete */}
        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <button
            onClick={() => setIsAddRoModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ เพิ่มระบบ RO</span>
          </button>

          {roSystems.length > 1 && (
            <button
              onClick={() => setIsConfirmDeleteRo(true)}
              className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
              title="ลบระบบ RO นี้"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ลบ RO นี้</span>
            </button>
          )}
        </div>
      </div>

      {/* Modal: Add New Company */}
      {isAddCompanyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span>เพิ่มบริษัทใหม่</span>
              </div>
              <button
                onClick={() => setIsAddCompanyModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCompanySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อบริษัท / Client Name
                </label>
                <input
                  type="text"
                  required
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="เช่น Lion Corporation (Thailand) Limited"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCompanyModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  บันทึกสร้างบริษัท
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New RO System */}
      {isAddRoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
                <Layers className="w-5 h-5 text-cyan-600" />
                <span>เพิ่มระบบ RO ใหม่ ({activeCompany?.name})</span>
              </div>
              <button
                onClick={() => setIsAddRoModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRoSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อระบบ RO (เช่น RO1, RO2 Pass 1)
                </label>
                <input
                  type="text"
                  required
                  value={newRoName}
                  onChange={(e) => setNewRoName(e.target.value)}
                  placeholder="เช่น RO1 Pass 1 หรือ RO6"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddRoModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  บันทึกสร้าง RO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirm Delete Company */}
      {isConfirmDeleteCompany && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-red-600 font-extrabold text-lg">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <span>ยืนยันลบบริษัท</span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              คุณแน่ใจหรือว่าต้องการลบบริษัท <strong className="text-slate-900">{activeCompany?.name}</strong>?
              <br />
              <span className="text-xs text-red-600 font-bold">
                ⚠️ การลบบริษัทนี้จะลบระบบ RO และรายงาน Membrane ทั้งหมดภายใต้บริษัทนี้ออกจากคลาวด์!
              </span>
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmDeleteCompany(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteCompany(activeCompanyId);
                  setIsConfirmDeleteCompany(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                ยืนยันลบบริษัท
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirm Delete RO */}
      {isConfirmDeleteRo && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-red-600 font-extrabold text-lg">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <span>ยืนยันลบระบบ RO</span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              คุณแน่ใจหรือว่าต้องการลบระบบ RO <strong className="text-slate-900">{activeRo?.name}</strong> ของ {activeCompany?.name}?
              <br />
              <span className="text-xs text-red-600 font-bold">
                ⚠️ รายงาน Membrane ทั้งหมดภายใต้ระบบ RO นี้จะถูกลบออกจากคลาวด์!
              </span>
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmDeleteRo(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteRO(activeRoId);
                  setIsConfirmDeleteRo(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                ยืนยันลบ RO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
