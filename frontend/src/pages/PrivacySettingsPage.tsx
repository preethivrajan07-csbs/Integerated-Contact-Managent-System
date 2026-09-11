import React, { useState } from 'react';
import { ShieldCheck, MapPin, Eye, EyeOff, Save, Check } from 'lucide-react';

export const PrivacySettingsPage: React.FC = () => {
  const [homeCity, setHomeCity] = useState('Chennai Central');
  const [homeLat, setHomeLat] = useState('13.0827');
  const [homeLng, setHomeLng] = useState('80.2707');
  const [defaultPrivacy, setDefaultPrivacy] = useState('APPROXIMATE');
  const [allowDiscovery, setAllowDiscovery] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-emerald-500" />
          <span>Location Privacy & Security Control</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure how your home location is masked and protected during nearby contact discovery.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Privacy settings saved successfully! Your exact home location remains completely protected.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">1. User Home Location</h3>
          <p className="text-xs text-slate-400 mb-4">Your home location is used to calculate proximity to nearby contacts.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">City / Region Area</label>
              <input
                type="text"
                value={homeCity}
                onChange={(e) => setHomeCity(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-xl bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Home Latitude</label>
              <input
                type="text"
                value={homeLat}
                onChange={(e) => setHomeLat(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-xl bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Home Longitude</label>
              <input
                type="text"
                value={homeLng}
                onChange={(e) => setHomeLng(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-xl bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">2. Privacy Sharing Controls</h3>
          
          <div className="space-y-3 mt-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">Default Location Visibility</p>
                <p className="text-xs text-slate-400">Show approximate city centroid area instead of house address</p>
              </div>
              <select
                value={defaultPrivacy}
                onChange={(e) => setDefaultPrivacy(e.target.value)}
                className="px-3 py-2 text-xs font-bold bg-white dark:bg-slate-700 border rounded-xl"
              >
                <option value="APPROXIMATE">APPROXIMATE (Recommended)</option>
                <option value="PRIVATE">PRIVATE (Completely Hidden)</option>
                <option value="PUBLIC">PUBLIC</option>
              </select>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">Nearby Contact Discovery</p>
                <p className="text-xs text-slate-400">Allow other users to see your approximate distance within radius scans</p>
              </div>
              <input
                type="checkbox"
                checked={allowDiscovery}
                onChange={(e) => setAllowDiscovery(e.target.checked)}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" className="flex items-center gap-2 bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md">
            <Save className="w-4 h-4" />
            <span>Save Privacy Rules</span>
          </button>
        </div>
      </form>
    </div>
  );
};
