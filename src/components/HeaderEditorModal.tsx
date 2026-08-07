import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Building2, FileText, Wrench, CalendarDays, Edit3 } from 'lucide-react';
import { HeaderConfig } from '../types';

interface HeaderEditorModalProps {
  isOpen: boolean;
  headerConfig?: HeaderConfig;
  initialConfig?: HeaderConfig;
  onSave: (newConfig: HeaderConfig) => void;
  onClose: () => void;
}

export const HeaderEditorModal: React.FC<HeaderEditorModalProps> = ({
  isOpen,
  headerConfig,
  initialConfig,
  onSave,
  onClose,
}) => {
  const currentConfig = headerConfig || initialConfig || {
    companyName: 'Lion Corporation (Thailand) Limited',
    reportTitle: 'RO4 Pass1 Membrane Cleaning Report',
    reportSubtitle: 'Service Report',
    jobDescription: 'Cleaning Membrane RO4 Pass1',
    servicePeriod: '10-16 June 2026',
  };

  const [companyName, setCompanyName] = useState<string>(currentConfig.companyName || '');
  const [reportTitle, setReportTitle] = useState<string>(currentConfig.reportTitle || '');
  const [reportSubtitle, setReportSubtitle] = useState<string>(currentConfig.reportSubtitle || '');
  const [jobDescription, setJobDescription] = useState<string>(currentConfig.jobDescription || '');
  const [servicePeriod, setServicePeriod] = useState<string>(currentConfig.servicePeriod || '');

  useEffect(() => {
    if (isOpen) {
      const cfg = headerConfig || initialConfig || {
        companyName: 'Lion Corporation (Thailand) Limited',
        reportTitle: 'RO4 Pass1 Membrane Cleaning Report',
        reportSubtitle: 'Service Report',
        jobDescription: 'Cleaning Membrane RO4 Pass1',
        servicePeriod: '10-16 June 2026',
      };
      setCompanyName(cfg.companyName || '');
      setReportTitle(cfg.reportTitle || '');
      setReportSubtitle(cfg.reportSubtitle || '');
      setJobDescription(cfg.jobDescription || '');
      setServicePeriod(cfg.servicePeriod || '');
    }
  }, [isOpen, headerConfig, initialConfig]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      companyName: companyName.trim() || 'Lion Corporation (Thailand) Limited',
      reportTitle: reportTitle.trim() || 'RO4 Pass1 Membrane Cleaning Report',
      reportSubtitle: reportSubtitle.trim() || 'Service Report',
      jobDescription: jobDescription.trim() || 'Cleaning Membrane RO4 Pass1',
      servicePeriod: servicePeriod.trim() || '10-16 June 2026',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 border border-blue-400/30 rounded-xl text-cyan-300">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">แก้ไขข้อมูลหัวข้อรายงาน & รายละเอียดงาน</h3>
              <p className="text-xs text-slate-300">ปรับเปลี่ยนชื่อบริษัท ชื่อรายงาน และข้อมูลระยะเวลาการให้บริการ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm text-slate-800">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              ชื่อบริษัท / ลูกค้า (Company Name)
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              placeholder="เช่น Lion Corporation (Thailand) Limited"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              ชื่อเรื่องรายงานหลัก (Main Report Title)
            </label>
            <input
              type="text"
              required
              value={reportTitle}
              onChange={e => setReportTitle(e.target.value)}
              placeholder="เช่น RO4 Pass1 Membrane Cleaning Report"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              ป้ายกำกับรายงาน / หัวข้อรอง (Report Subtitle Badge)
            </label>
            <input
              type="text"
              value={reportSubtitle}
              onChange={e => setReportSubtitle(e.target.value)}
              placeholder="เช่น Service Report / June 2026"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-blue-600" />
              รายละเอียดงาน (Job Description)
            </label>
            <input
              type="text"
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="เช่น Cleaning Membrane RO4 Pass1"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-blue-600" />
              ระยะเวลาให้บริการ (Service Period)
            </label>
            <input
              type="text"
              value={servicePeriod}
              onChange={e => setServicePeriod(e.target.value)}
              placeholder="เช่น 10-16 June 2026"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-all cursor-pointer"
            >
              ยกเลิก (Cancel)
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>บันทึกหัวข้อรายงาน</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
