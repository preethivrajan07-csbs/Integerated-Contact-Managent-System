import React, { useState, useEffect } from 'react';
import { History, Calendar, MapPin, Phone, MessageSquare, Mail, User } from 'lucide-react';
import { Contact } from '../types';
import { fetchContacts } from '../services/api';

interface TimelinePageProps {
  onSelectContact: (contact: Contact) => void;
}

export const TimelinePage: React.FC<TimelinePageProps> = ({ onSelectContact }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    fetchContacts().then(setContacts);
  }, []);

  // Aggregate all timeline interactions across all contacts
  const allEntries: {
    contact: Contact;
    date: string;
    type: string;
    notes: string;
    location?: string;
    event?: string;
  }[] = [];

  contacts.forEach((c) => {
    if (c.interactions) {
      c.interactions.forEach((i) => {
        allEntries.push({
          contact: c,
          date: i.interactionDate?.split('T')[0] || '2026-08-10',
          type: i.interactionType,
          notes: i.notes || '',
          location: i.locationName,
          event: i.relatedEventName,
        });
      });
    }
  });

  // Sort chronologically descending
  allEntries.sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <History className="w-7 h-7 text-indigo-600" />
          <span>Global Contact Timeline</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Chronological living history stream connecting people, meetings, calls, and events over time.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-indigo-500/20 pl-10">
          {allEntries.map((entry, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-10 top-1.5 w-5 h-5 rounded-full bg-indigo-600 border-4 border-white dark:border-slate-900 shadow-sm" />

              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 p-4 rounded-2xl space-y-2 hover:border-indigo-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <div
                    onClick={() => onSelectContact(entry.contact)}
                    className="flex items-center gap-2 cursor-pointer group-hover:text-indigo-600"
                  >
                    <User className="w-4 h-4 text-indigo-500" />
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{entry.contact.fullName}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {entry.contact.category}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-slate-400">{entry.date}</span>
                </div>

                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {entry.type}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{entry.notes}</p>

                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
                  {entry.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{entry.location}</span>
                    </span>
                  )}
                  {entry.event && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-purple-500" />
                      <span>Event: {entry.event}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
