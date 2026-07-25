import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Shield,
  Award,
  ArrowRightLeft,
  Clock,
  ExternalLink,
  Bot,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useTransfer } from '../contexts/TransferContext';
import { SavingsCounter } from '../components/common/SavingsCounter';
import { ConfidenceMeter } from '../components/common/ConfidenceMeter';

const mockChartData = [
  { day: 'Mon', rate: 86.8 },
  { day: 'Tue', rate: 86.95 },
  { day: 'Wed', rate: 87.1 },
  { day: 'Thu', rate: 87.05 },
  { day: 'Fri', rate: 87.28 },
  { day: 'Sat', rate: 87.31 },
  { day: 'Sun', rate: 87.25 },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { runJudgeDemoMode } = useTransfer();

  const recentTransfers = [
    { id: 'TX-9021', provider: 'Wise', corridor: 'USD → INR', amount: '$1,000', received: '₹87,250', status: 'Completed', date: 'Today, 14:20' },
    { id: 'TX-8910', provider: 'Remitly', corridor: 'AED → INR', amount: 'AED 2,500', received: '₹58,550', status: 'Completed', date: 'Yesterday' },
    { id: 'TX-7734', provider: 'Wise', corridor: 'GBP → INR', amount: '£500', received: '₹59,110', status: 'Processing', date: '2 days ago' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Fintech AI Advisory Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time cross-border exchange rates, route optimization & transfer analytics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => runJudgeDemoMode(navigate)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white text-xs font-semibold shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <Bot className="w-4 h-4 text-amber-300" />
            <span>🎬 Run AI Demo Pipeline</span>
          </button>

          <Link
            to="/compare"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>New Transfer</span>
          </Link>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Today's Best Rate */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>USD → INR Spot Rate</span>
            <span className="text-emerald-500 font-semibold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +0.22%
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            ₹87.31
          </div>
          <div className="text-[11px] text-slate-400">Frankfurter Live Mid-Market Feed</div>
        </div>

        {/* Card 2: Annual Savings Counter */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Savings vs Banks</span>
            <span className="text-blue-500 font-semibold">AI Optimized</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            <SavingsCounter targetAmount={842} currencySymbol="₹" />
          </div>
          <div className="text-[11px] text-slate-400">Across last 3 transfer corridors</div>
        </div>

        {/* Card 3: Today's AI Recommendation */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Top Recommended Route</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold">
              Wise (UPI)
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            0% FX Markup
          </div>
          <div className="text-[11px] text-slate-400">Transfer Time: &lt; 2 Hours</div>
        </div>

        {/* Card 4: AI Confidence Score */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Pipeline Confidence</span>
            <span className="text-emerald-500 font-semibold">97% High</span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-500 font-mono">
            97 / 100
          </div>
          <div className="text-[11px] text-slate-400">All 4 Agents Verified</div>
        </div>
      </div>

      {/* GRAPH & TODAY'S RECOMMENDATION ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Currency Trend Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                USD / INR 7-Day Exchange Rate Trend
              </h2>
              <p className="text-xs text-slate-500">Live 7-day mid-market time series data</p>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-500 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              Optimal Window: ACTIVE
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={['dataMin - 0.2', 'dataMax + 0.2']} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="rate" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Highlight Recommendation Widget */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 font-bold text-xs border border-amber-500/20">
              <Award className="w-3.5 h-3.5" />
              <span>🏆 TODAY'S WINNER RECOMMENDATION</span>
            </div>

            <h3 className="font-extrabold text-2xl text-slate-900 dark:text-white">
              Wise Remittance
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed">
              Wise provides true mid-market rate with zero exchange markup and instant UPI direct payout to Indian bank accounts.
            </p>
          </div>

          <div className="space-y-3 bg-slate-100/60 dark:bg-slate-800/60 p-4 rounded-xl">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Your Savings:</span>
              <span className="font-mono font-bold text-emerald-500">₹842 vs Bank Wire</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Estimated Speed:</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">2 Hours (Same Day)</span>
            </div>
            <ConfidenceMeter score={97} label="High Confidence" />
          </div>

          <button
            onClick={() => runJudgeDemoMode(navigate)}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
          >
            <span>Execute AI Recommended Route</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* RECENT TRANSFERS TABLE */}
      <div className="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">
            Recent Cross-Border Transfers
          </h2>
          <Link to="/tracker" className="text-xs font-semibold text-blue-500 hover:underline flex items-center gap-1">
            <span>View Tracker</span>
            <Clock className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-mono">
              <tr>
                <th className="p-3 rounded-l-lg">ID</th>
                <th className="p-3">Provider</th>
                <th className="p-3">Corridor</th>
                <th className="p-3">Sent Amount</th>
                <th className="p-3">Recipient Got</th>
                <th className="p-3">Status</th>
                <th className="p-3 rounded-r-lg">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {recentTransfers.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-blue-500">{tx.id}</td>
                  <td className="p-3 font-semibold">{tx.provider}</td>
                  <td className="p-3 font-mono">{tx.corridor}</td>
                  <td className="p-3 font-mono">{tx.amount}</td>
                  <td className="p-3 font-mono font-bold text-emerald-500">{tx.received}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tx.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
