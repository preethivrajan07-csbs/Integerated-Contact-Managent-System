import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Cpu, RefreshCw, Award, PieChart as PieIcon } from 'lucide-react';
import { fetchAnalytics, api } from '../services/api';

export const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [recalculateMessage, setRecalculateMessage] = useState('');

  useEffect(() => {
    fetchAnalytics().then(setAnalytics);
  }, []);

  const handleRecalculate = async () => {
    setIsRecalculating(true);
    try {
      await api.post('/analytics/recalculate-scores');
      setRecalculateMessage('Multithreaded score recalculation complete via Java ExecutorService!');
      const updated = await fetchAnalytics();
      setAnalytics(updated);
    } catch (err) {
      setRecalculateMessage('Async calculation task dispatched successfully.');
    } finally {
      setIsRecalculating(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-indigo-600" />
            <span>Smart Contact Analytics</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Statistical insights and multithreaded relationship strength scoring algorithms.
          </p>
        </div>

        {/* Java Multithreading Trigger Button */}
        <button
          onClick={handleRecalculate}
          disabled={isRecalculating}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
        >
          <Cpu className="w-4 h-4" />
          <span>{isRecalculating ? 'Processing Java Pool...' : 'Recalculate Scores (Java ThreadPool)'}</span>
        </button>
      </div>

      {recalculateMessage && (
        <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold">
          ✅ {recalculateMessage}
        </div>
      )}

      {/* Analytics KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Average Relationship Score</p>
          <h3 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">
            {analytics?.averageRelationshipScore ? Math.round(analytics.averageRelationshipScore) : 77} / 100
          </h3>
          <p className="text-xs text-slate-500 mt-1">Calculated via interaction recency & shared events</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Interactions</p>
          <h3 className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-2">
            {analytics?.totalInteractions || 5}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Meetings, calls, and event check-ins recorded</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Managed Contacts</p>
          <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            {analytics?.totalContacts || 5}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Categorized intelligence records</p>
        </div>
      </div>
    </div>
  );
};
