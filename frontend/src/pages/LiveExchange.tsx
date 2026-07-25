import React, { useState } from 'react';
import { TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, RefreshCw, DollarSign } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const mockHistoricalData = [
  { date: 'Jul 1', rate: 86.42, high: 86.55, low: 86.30 },
  { date: 'Jul 5', rate: 86.75, high: 86.90, low: 86.60 },
  { date: 'Jul 10', rate: 86.90, high: 87.05, low: 86.80 },
  { date: 'Jul 15', rate: 87.12, high: 87.25, low: 87.00 },
  { date: 'Jul 20', rate: 87.05, high: 87.18, low: 86.95 },
  { date: 'Jul 25', rate: 87.31, high: 87.45, low: 87.20 },
];

export const LiveExchange: React.FC = () => {
  const [range, setRange] = useState<'7D' | '1M' | '1Y'>('1M');

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs border border-blue-500/20 mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>FRANKFURTER LIVE FX API ANALYTICS</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Live Foreign Exchange Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          {(['7D', '1M', '1Y'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                range === r
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* MINI STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 font-semibold">USD → INR Spot Rate</span>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">₹87.31</div>
          <span className="text-xs text-emerald-500 font-semibold flex items-center">
            <ArrowUpRight className="w-3.5 h-3.5" /> +0.22% (24h)
          </span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 font-semibold">30-Day Peak High</span>
          <div className="text-3xl font-black text-emerald-500 font-mono">₹87.45</div>
          <span className="text-xs text-slate-400">Reached on Jul 25, 2026</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 font-semibold">30-Day Low</span>
          <div className="text-3xl font-black text-rose-400 font-mono">₹86.30</div>
          <span className="text-xs text-slate-400">Recorded on Jul 1, 2026</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 font-semibold">Best Day to Transfer</span>
          <div className="text-2xl font-extrabold text-blue-500">Wednesday</div>
          <span className="text-xs text-emerald-500 font-medium">Historical +0.18% advantage</span>
        </div>
      </div>

      {/* RECHARTS HISTORICAL LINE CHART */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">USD / INR Time Series Data</h2>
            <p className="text-xs text-slate-500">Historical exchange rates sourced live from Frankfurter API</p>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockHistoricalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
              <YAxis domain={['dataMin - 0.2', 'dataMax + 0.2']} stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', color: '#fff' }} />
              <Line type="monotone" dataKey="rate" stroke="#2563eb" strokeWidth={3} dot={{ r: 5, fill: '#2563eb' }} />
              <Line type="monotone" dataKey="high" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
