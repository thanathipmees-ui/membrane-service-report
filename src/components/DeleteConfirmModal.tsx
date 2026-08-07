import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { MembraneData } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  membrane: MembraneData | null;
  totalCount: number;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  membrane,
  totalCount,
  onConfirm,
  onClose,
}) => {
  if (!isOpen || !membrane) return null;

  const isOnlyOne = totalCount <= 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-100 overflow-hidden transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">ยืนยันการลบรายงาน</h3>
              <p className="text-xs text-slate-500 font-medium">Membrane No. {membrane.membraneNo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {isOnlyOne ? (
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs leading-relaxed font-medium">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900 text-sm mb-1">ไม่สามารถลบรายการนี้ได้</p>
                <p>ระบบจำเป็นต้องมีรายงานอย่างน้อย 1 รายการ ไม่สามารถลบรายงานชิ้นสุดท้ายในระบบได้</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 leading-relaxed">
                คุณแน่ใจหรือไม่ว่าต้องการลบรายงาน <span className="font-bold text-slate-900">Membrane No. {membrane.membraneNo}</span>
                {membrane.serialNumber && <span> (Serial: <span className="font-semibold text-slate-800">{membrane.serialNumber}</span>)</span>} ออกจากระบบ?
              </p>
              <p className="text-xs text-red-500 font-medium bg-red-50/70 p-3 rounded-lg border border-red-100">
                ⚠️ การลบนี้จะมีผลทันที รายงานนี้จะถูกลบออกจากรายการ
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
          >
            {isOnlyOne ? 'รับทราบ' : 'ยกเลิก'}
          </button>

          {!isOnlyOne && (
            <button
              onClick={onConfirm}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-500/20 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>ยืนยันลบหน้านี้</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
