import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  MapPin, 
  History, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  ArrowUpRight,
  Plus,
  Compass
} from 'lucide-react';
import { Contact, Event, Suggestion, NotificationItem } from '../types';
import { fetchContacts, fetchEvents, fetchSmartSuggestions, fetchNotifications } from '../services/api';

interface DashboardPageProps {
  setActiveTab: (tab: string) => void;
  onOpenAddModal: () => void;
  onSelectContact: (contact: Contact) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  setActiveTab,
  onOpenAddModal,
  onSelectContact,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [cList, eList, sList] = await Promise.all([
          fetchContacts(),
          fetchEvents(),
          fetchSmartSuggestions('AI Hackathon', 'Chennai'),
        ]);
        setContacts(cList);
        setEvents(eList);
        setSuggestions(sList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const totalMeetingLocations = contacts.reduce((sum, c) => sum + (c.meetingLocations?.length || 0), 0);
  const totalInteractions = contacts.reduce((sum, c) => sum + (c.interactions?.length || 0), 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Banner / Welcome Header */}
      <div className="rounded-3xl gradient-brand p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-500/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Contact Intelligence Engine Active</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Integrated Contact Management System
          </h1>
          <p className="text-indigo-100 text-sm mt-2 leading-relaxed">
            Remember who people are, where and when you met them, and in what context. 
            Privacy-aware location intelligence powered by Spring Boot.
          </p>

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-sm px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Contact</span>
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className="flex items-center gap-2 bg-indigo-800/60 hover:bg-indigo-800/80 text-white font-semibold text-sm px-4 py-2.5 rounded-xl border border-white/20 transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Smart Suggestions</span>
            </button>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Contacts</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{contacts.length}</h3>
            <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Categorized Intelligence
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Events & Groups</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{events.length}</h3>
            <span className="text-[11px] text-indigo-500 font-semibold flex items-center gap-1 mt-1">
              Connected Networks
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Meeting Places</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalMeetingLocations}</h3>
            <span className="text-[11px] text-amber-500 font-semibold flex items-center gap-1 mt-1">
              Location Aware
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Interactions Recorded</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalInteractions}</h3>
            <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1 mt-1">
              Living Timeline History
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
            <History className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Section: Context Suggestions & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Smart Recommendations Column (2 spans) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">Context-Based Recommendations</h2>
            </div>
            <button
              onClick={() => setActiveTab('suggestions')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>Explore All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-500">
            Suggested relevant contacts for upcoming event context: <span className="font-semibold text-indigo-600">AI Hackathon 2026</span>
          </p>

          <div className="space-y-3">
            {suggestions.slice(0, 3).map((sugg) => (
              <div
                key={sugg.contactId}
                onClick={() => {
                  const c = contacts.find(x => x.id === sugg.contactId);
                  if (c) onSelectContact(c);
                }}
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center">
                    {sugg.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600">
                        {sugg.fullName}
                      </h4>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                        {sugg.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{sugg.rationale}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full">
                    ⭐ {sugg.relevanceScore}% Match
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events Column */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>Upcoming Events</span>
            </h2>
            <button
              onClick={() => setActiveTab('events')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View Events
            </button>
          </div>

          <div className="space-y-3">
            {events.map((ev) => (
              <div key={ev.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                    {ev.category}
                  </span>
                  <span className="text-xs font-medium text-slate-500">{ev.eventDate}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-white mt-1">{ev.eventName}</h4>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{ev.locationName}</span>
                </p>

                <div className="flex items-center gap-1 mt-3">
                  <span className="text-[11px] text-slate-400 font-semibold mr-1">Participants:</span>
                  {ev.participants?.map((p) => (
                    <span key={p.id} className="w-6 h-6 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center border border-white dark:border-slate-800" title={p.fullName}>
                      {p.fullName.charAt(0)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
