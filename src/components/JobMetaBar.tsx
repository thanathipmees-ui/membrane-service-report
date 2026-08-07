import React from 'react';
import { Building2, Wrench, CalendarDays } from 'lucide-react';
import { HeaderConfig } from '../types';

interface JobMetaBarProps {
  totalCount: number;
  headerConfig?: HeaderConfig;
}

export const JobMetaBar: React.FC<JobMetaBarProps> = ({ totalCount, headerConfig }) => {
  const companyName = headerConfig?.companyName || 'Lion Corporation (Thailand) Limited';
  const jobDescription = headerConfig?.jobDescription || 'Cleaning Membrane RO4 Pass1';
  const servicePeriod = headerConfig?.servicePeriod || '10-16 June 2026';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-900/5 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 overflow-hidden text-slate-800 relative group">
      <div className="p-4 sm:p-5 flex items-start gap-3.5 bg-gradient-to-br from-slate-50/50 to-white">
        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Customer / บริษัท</span>
          <strong className="block text-sm font-bold text-slate-900 mt-0.5">{companyName}</strong>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex items-start gap-3.5 bg-gradient-to-br from-slate-50/50 to-white">
        <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100 shrink-0">
          <Wrench className="w-5 h-5" />
        </div>
        <div>
          <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Job Description / ชื่องาน</span>
          <strong className="block text-sm font-bold text-slate-900 mt-0.5">{jobDescription}</strong>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex items-start gap-3.5 bg-gradient-to-br from-slate-50/50 to-white">
        <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
          <CalendarDays className="w-5 h-5" />
        </div>
        <div>
          <span className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Service Period / Quantity</span>
          <strong className="block text-sm font-bold text-slate-900 mt-0.5">{servicePeriod} / {totalCount} pcs.</strong>
        </div>
      </div>
    </div>
  );
};
