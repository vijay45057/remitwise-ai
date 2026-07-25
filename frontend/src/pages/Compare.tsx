import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Bot, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { useTransfer } from '../contexts/TransferContext';
import { SUPPORTED_COUNTRIES } from '../utils/constants';

export const Compare: React.FC = () => {
  const navigate = useNavigate();
  const { request, setRequest, runPipeline } = useTransfer();

  const handleCountryChange = (type: 'from' | 'to', code: string) => {
    const found = SUPPORTED_COUNTRIES.find((c) => c.code === code);
    if (!found) return;
    if (type === 'from') {
      setRequest((prev) => ({ ...prev, fromCountry: found }));
    } else {
      setRequest((prev) => ({ ...prev, toCountry: found }));
    }
  };

  const handleStartSearch = async () => {
    // Navigate immediately to AI Pipeline screen to trigger agent work
    navigate('/pipeline');
    await runPipeline();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-xs border border-blue-500/20">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive Corridor Search</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Find Your Best Remittance Route
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Input your transfer corridor details and trigger our 4 autonomous AI agents to search providers, predict exchange timing, and check compliance.
        </p>
      </div>

      {/* SEARCH FORM PANEL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-6 sm:p-8 rounded-3xl space-y-8 border border-slate-200/80 dark:border-slate-800 shadow-2xl"
      >
        {/* CORRIDOR SELECTORS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sender Country */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Sender Country (From)
            </label>
            <select
              value={request.fromCountry.code}
              onChange={(e) => handleCountryChange('from', e.target.value)}
              className="w-full p-3.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {SUPPORTED_COUNTRIES.filter((c) => c.code !== request.toCountry.code).map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name} ({country.currency})
                </option>
              ))}
            </select>
          </div>

          {/* Receiver Country */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Receiver Country (To)
            </label>
            <select
              value={request.toCountry.code}
              onChange={(e) => handleCountryChange('to', e.target.value)}
              className="w-full p-3.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {SUPPORTED_COUNTRIES.filter((c) => c.code !== request.fromCountry.code).map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name} ({country.currency})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* AMOUNT & URGENCY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Transfer Amount Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Send Amount ({request.fromCountry.currencySymbol})
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">
                {request.fromCountry.currencySymbol}
              </span>
              <input
                type="number"
                min="10"
                max="50000"
                value={request.amount}
                onChange={(e) => setRequest((prev) => ({ ...prev, amount: Number(e.target.value) || 0 }))}
                className="w-full p-3.5 pl-10 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-extrabold text-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Urgency Preference */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Speed Preference
            </label>
            <select
              value={request.urgency}
              onChange={(e) => setRequest((prev) => ({ ...prev, urgency: e.target.value as any }))}
              className="w-full p-3.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="instant">⚡ Instant (Minutes - Cash/UPI)</option>
              <option value="same-day">🚀 Same Day (&lt; 2 Hours)</option>
              <option value="standard">⏳ Standard (1 - 3 Days)</option>
            </select>
          </div>
        </div>

        {/* PAYMENT & RECEIVE METHODS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Payment Method
            </label>
            <select
              value={request.paymentMethod}
              onChange={(e) => setRequest((prev) => ({ ...prev, paymentMethod: e.target.value }))}
              className="w-full p-3 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Debit Card">Debit Card (Instant)</option>
              <option value="Bank Transfer (ACH)">Bank Transfer (ACH / Wire)</option>
              <option value="Credit Card">Credit Card</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Payout Delivery Method
            </label>
            <select
              value={request.receiveMethod}
              onChange={(e) => setRequest((prev) => ({ ...prev, receiveMethod: e.target.value }))}
              className="w-full p-3 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="UPI Direct">UPI Direct (Instant Account Credit)</option>
              <option value="Bank Account">Direct Bank Account Deposit</option>
              <option value="Cash Pickup">Cash Pickup Point</option>
            </select>
          </div>
        </div>

        {/* TRIGGER BUTTON */}
        <div className="pt-4">
          <button
            onClick={handleStartSearch}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 hover:opacity-95 text-white font-extrabold text-base shadow-xl shadow-blue-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Bot className="w-5 h-5" />
            <span>Find Best Route with 4 AI Agents</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
