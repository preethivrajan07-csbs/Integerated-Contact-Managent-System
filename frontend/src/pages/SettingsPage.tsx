import React from 'react';
import { Settings, Database, Server, HardDrive, Shield } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-7 h-7 text-indigo-600" />
          <span>Application Settings & Stack Information</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">System architecture specifications and database status.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
          Backend & Architecture Stack
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="font-bold text-indigo-600 uppercase text-[10px]">Java Spring Boot REST API</span>
            <p className="font-bold text-slate-800 dark:text-white text-sm">Spring Boot 3.2 + Spring Data JPA</p>
            <p className="text-slate-400">Hibernate ORM with custom JPA repositories</p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="font-bold text-purple-600 uppercase text-[10px]">Database Layer</span>
            <p className="font-bold text-slate-800 dark:text-white text-sm">H2 Embedded (Zero-setup) / MySQL</p>
            <p className="text-slate-400">Relational schema with foreign key constraints</p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="font-bold text-emerald-600 uppercase text-[10px]">Async Processing</span>
            <p className="font-bold text-slate-800 dark:text-white text-sm">Java ExecutorService + CompletableFuture</p>
            <p className="text-slate-400">Multithreaded background score calculation pool</p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="font-bold text-rose-600 uppercase text-[10px]">Map & Location Engine</span>
            <p className="font-bold text-slate-800 dark:text-white text-sm">OpenStreetMap + Leaflet JS</p>
            <p className="text-slate-400">Haversine distance formula with centroid fuzzing</p>
          </div>
        </div>
      </div>
    </div>
  );
};
