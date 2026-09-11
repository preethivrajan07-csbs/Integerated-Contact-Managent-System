import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, MapPin, Tag, ArrowRight, User } from 'lucide-react';
import { Suggestion, Contact } from '../types';
import { fetchSmartSuggestions, fetchContacts } from '../services/api';

interface SmartSuggestionsPageProps {
  onSelectContact: (contact: Contact) => void;
}

export const SmartSuggestionsPage: React.FC<SmartSuggestionsPageProps> = ({ onSelectContact }) => {
  const [eventContext, setEventContext] = useState('AI Hackathon');
  const [locationContext, setLocationContext] = useState('Chennai');
  const [categoryContext, setCategoryContext] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);

  useEffect(() => {
    fetchContacts().then(setAllContacts);
  }, []);

  useEffect(() => {
    fetchSmartSuggestions(eventContext, locationContext, categoryContext).then(setSuggestions);
  }, [eventContext, locationContext, categoryContext]);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-amber-500" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Context-Based Contact Suggestions</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Intelligent recommendation engine analyzing past events, locations, categories, and interaction history.
        </p>
      </div>

      {/* Context Filter Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Tag className="w-4 h-4 text-indigo-600" />
          <span>Set Current Activity / Event Context</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Event Context / Name
            </label>
            <input
              type="text"
              value={eventContext}
              onChange={(e) => setEventContext(e.target.value)}
              placeholder="e.g. AI Hackathon 2026"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Location / Area
            </label>
            <input
              type="text"
              value={locationContext}
              onChange={(e) => setLocationContext(e.target.value)}
              placeholder="e.g. Chennai"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category Filter
            </label>
            <select
              value={categoryContext}
              onChange={(e) => setCategoryContext(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            >
              <option value="">All Categories</option>
              <option value="COLLEGE">COLLEGE</option>
              <option value="PROFESSIONAL">PROFESSIONAL</option>
              <option value="FRIEND">FRIEND</option>
              <option value="OFFICE">OFFICE</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rationale Cards */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          Recommended Contacts ({suggestions.length})
        </h3>

        {suggestions.map((sugg) => (
          <div
            key={sugg.contactId}
            onClick={() => {
              const found = allContacts.find(c => c.id === sugg.contactId);
              if (found) onSelectContact(found);
            }}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-amber-500/60 hover:shadow-lg transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                {sugg.fullName.charAt(0)}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600">
                    {sugg.fullName}
                  </h4>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    ⭐ {sugg.relevanceScore}% Match
                  </span>
                </div>

                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                  Rationale: {sugg.rationale}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                  {sugg.previousEventName && <span>🎫 {sugg.previousEventName}</span>}
                  {sugg.meetingLocationName && <span>📍 {sugg.meetingLocationName}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform self-end md:self-auto">
              <span>View Profile</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
