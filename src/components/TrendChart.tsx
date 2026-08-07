import React from 'react';
import { TestCycle, TestMetrics } from '../types';
import { formatNumber, valueText } from '../utils/calculations';

interface TrendChartProps {
  title: string;
  metricKey: keyof TestMetrics;
  unit?: string;
  cycles: TestCycle[];
  beforeLabel?: string;
  afterLabel?: string;
}

export const TrendChart: React.FC<TrendChartProps> = ({
  title,
  metricKey,
  unit = '%',
  cycles,
  beforeLabel = 'Before',
  afterLabel = 'After',
}) => {
  const validCycles = cycles.filter(c => c.before && c.after).slice(-5);

  if (!validCycles.length) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-500 font-medium">
        ไม่มีข้อมูลกราฟสำหรับ {title}
      </div>
    );
  }

  const beforeValues = validCycles.map(c => Number(c.before[metricKey]));
  const afterValues = validCycles.map(c => Number(c.after[metricKey]));
  const allValues = [...beforeValues, ...afterValues].filter(v => !isNaN(v) && v !== null);

  const rawMin = allValues.length ? Math.min(...allValues) : 0;
  const rawMax = allValues.length ? Math.max(...allValues) : 100;
  const padding = Math.max((rawMax - rawMin) * 0.2, 2);
  const min = Math.max(0, Math.floor(rawMin - padding));
  const max = Math.ceil(rawMax + padding);

  const width = 380;
  const height = 180;
  const left = 44;
  const right = 20;
  const top = 22;
  const bottom = 38;

  const plotW = width - left - right;
  const plotH = height - top - bottom;

  const getX = (index: number) => {
    if (validCycles.length === 1) return left + plotW / 2;
    return left + (plotW * index) / (validCycles.length - 1);
  };

  const getY = (val: number) => {
    if (isNaN(val)) return top + plotH / 2;
    const range = Math.max(max - min, 1);
    return top + plotH - ((val - min) / range) * plotH;
  };

  const formatShortDate = (str: string) => {
    return str.replace(/(\d+) ([A-Za-z]+) (\d+)/, (_, day, month, year) => `${day} ${month.slice(0, 3)} ${year.slice(2)}`);
  };

  const beforePointsStr = beforeValues
    .map((v, i) => (!isNaN(v) ? `${getX(i)},${getY(v)}` : ''))
    .filter(Boolean)
    .join(' ');

  const afterPointsStr = afterValues
    .map((v, i) => (!isNaN(v) ? `${getX(i)},${getY(v)}` : ''))
    .filter(Boolean)
    .join(' ');

  const gridSteps = [min, Math.round((min + max) / 2), max];

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">{title}</h4>
        <div className="flex items-center gap-3 text-[11px] font-bold">
          <span className="flex items-center gap-1 text-amber-700">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block" /> {beforeLabel}
          </span>
          <span className="flex items-center gap-1 text-emerald-700">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block" /> {afterLabel}
          </span>
        </div>
      </div>

      <svg className="w-full h-auto overflow-visible" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
        {/* Grid lines */}
        {gridSteps.map((step, idx) => (
          <g key={`${step}-${idx}`}>
            <line
              x1={left}
              x2={width - right}
              y1={getY(step)}
              y2={getY(step)}
              stroke="#e2e8f0"
              strokeDasharray="3 3"
              strokeWidth={1}
            />
            <text x={left - 6} y={getY(step) + 3} textAnchor="end" className="text-[10px] fill-slate-400 font-bold">
              {step}{unit === '%' ? '%' : ''}
            </text>
          </g>
        ))}

        {/* X Axis line */}
        <line x1={left} x2={width - right} y1={height - bottom} y2={height - bottom} stroke="#cbd5e1" strokeWidth={1.5} />

        {/* Polyline Before */}
        {beforePointsStr && <polyline points={beforePointsStr} fill="none" stroke="#d97706" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />}

        {/* Polyline After */}
        {afterPointsStr && <polyline points={afterPointsStr} fill="none" stroke="#059669" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />}

        {/* Data Points Before */}
        {beforeValues.map((v, i) =>
          !isNaN(v) ? (
            <g key={`b-${i}`}>
              <circle cx={getX(i)} cy={getY(v)} r={4} className="fill-amber-100 stroke-amber-600 stroke-[2]" />
              <text x={getX(i)} y={getY(v) - 7} textAnchor="middle" className="text-[10px] fill-amber-900 font-extrabold">
                {formatNumber(v)}{unit === '%' ? '%' : ''}
              </text>
            </g>
          ) : null
        )}

        {/* Data Points After */}
        {afterValues.map((v, i) =>
          !isNaN(v) ? (
            <g key={`a-${i}`}>
              <circle cx={getX(i)} cy={getY(v)} r={4} className="fill-emerald-100 stroke-emerald-600 stroke-[2]" />
              <text x={getX(i)} y={getY(v) - 7} textAnchor="middle" className="text-[10px] fill-emerald-900 font-extrabold">
                {formatNumber(v)}{unit === '%' ? '%' : ''}
              </text>
            </g>
          ) : null
        )}

        {/* X Labels */}
        {validCycles.map((c, i) => (
          <text key={i} x={getX(i)} y={height - 10} textAnchor="middle" className="text-[10px] fill-slate-500 font-bold">
            {formatShortDate(c.date)}
          </text>
        ))}
      </svg>

      {/* Mini data table */}
      <div className="overflow-x-auto pt-1">
        <table className="w-full text-[11px] border-collapse text-right">
          <thead>
            <tr className="border-t border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
              <th className="py-1 text-left">Date</th>
              <th className="py-1 text-amber-700">{beforeLabel}</th>
              <th className="py-1 text-emerald-700">{afterLabel}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {validCycles.map((c, i) => (
              <tr key={i}>
                <td className="py-1 text-left text-slate-600 font-medium">{formatShortDate(c.date)}</td>
                <td className="py-1 text-amber-800 font-bold bg-amber-50/50 px-1.5 rounded">{valueText(c.before[metricKey], unit)}</td>
                <td className="py-1 text-emerald-800 font-bold bg-emerald-50/50 px-1.5 rounded">{valueText(c.after[metricKey], unit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
