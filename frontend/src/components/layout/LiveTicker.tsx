import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

const TICKER_PAIRS = [
  { pair: 'AED → INR', rate: 23.42, change: '+0.15%', isUp: true },
  { pair: 'USD → INR', rate: 87.31, change: '-0.08%', isUp: false },
  { pair: 'GBP → INR', rate: 118.22, change: '+0.42%', isUp: true },
  { pair: 'CAD → INR', rate: 63.44, change: '-0.12%', isUp: false },
  { pair: 'AUD → INR', rate: 56.90, change: '+0.28%', isUp: true },
  { pair: 'SGD → INR', rate: 65.18, change: '+0.10%', isUp: true },
  { pair: 'USD → PHP', rate: 58.45, change: '+0.05%', isUp: true },
  { pair: 'USD → MXN', rate: 18.12, change: '-0.30%', isUp: false },
  { pair: 'EUR → INR', rate: 96.75, change: '+0.18%', isUp: true },
  { pair: 'JPY → INR', rate: 0.58, change: '-0.22%', isUp: false },
];

interface TickerItem {
  pair: string;
  rate: number;
  change: string;
  isUp: boolean;
  displayRate: string;
}

export const LiveTicker: React.FC = () => {
  const [items, setItems] = useState<TickerItem[]>(
    TICKER_PAIRS.map((p) => ({ ...p, displayRate: p.rate.toFixed(2) }))
  );

  // Randomly fluctuate rates every 3 seconds for a "live" feel
  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) =>
        prev.map((item) => {
          const fluctuation = (Math.random() - 0.5) * 0.08;
          const newRate = parseFloat((item.rate + fluctuation).toFixed(2));
          const isUp = fluctuation >= 0;
          const pctChange = ((fluctuation / item.rate) * 100).toFixed(2);
          return {
            ...item,
            rate: newRate,
            displayRate: newRate.toFixed(2),
            isUp,
            change: `${isUp ? '+' : ''}${pctChange}%`,
          };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Duplicate for seamless infinite scroll
  const allItems = [...items, ...items];

  return (
    <div className="w-full bg-slate-950 border-b border-slate-800/80 select-none overflow-hidden">
      <div className="max-w-full flex items-center h-8">
        {/* Label chip */}
        <div className="flex items-center gap-1.5 px-3 py-1 border-r border-slate-800 shrink-0 bg-slate-900/80 h-full">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
            Live FX
          </span>
        </div>

        {/* Scrolling ticker */}
        <div className="overflow-hidden flex-1 relative">
          <div className="ticker-track">
            {allItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 mx-4 font-mono shrink-0"
              >
                <span className="text-[11px] text-slate-400">{item.pair}</span>
                <span
                  className={`text-[11px] font-bold transition-colors duration-700 ${
                    item.isUp ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {item.displayRate}
                </span>
                <span
                  className={`flex items-center text-[10px] font-semibold ${
                    item.isUp ? 'text-emerald-500' : 'text-rose-500'
                  }`}
                >
                  {item.isUp ? (
                    <TrendingUp className="w-2.5 h-2.5 mr-px" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5 mr-px" />
                  )}
                  {item.change}
                </span>
                <span className="text-slate-700 ml-2">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right side label */}
        <div className="flex items-center gap-1 px-3 border-l border-slate-800 shrink-0 bg-slate-900/80 h-full">
          <Zap className="w-2.5 h-2.5 text-amber-400" />
          <span className="text-[10px] text-slate-500 font-mono">Frankfurter</span>
        </div>
      </div>
    </div>
  );
};
