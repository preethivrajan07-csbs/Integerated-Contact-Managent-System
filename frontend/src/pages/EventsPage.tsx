import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Plus, UserPlus, Check, X } from 'lucide-react';
import { Event, Contact } from '../types';
import { fetchEvents, fetchContacts, createEvent, addParticipantToEvent } from '../services/api';

interface EventsPageProps {
  onSelectContact: (contact: Contact) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onSelectContact }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);

  // Form states
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [locationName, setLocationName] = useState('');
  const [category, setCategory] = useState('Hackathon');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [eList, cList] = await Promise.all([fetchEvents(), fetchContacts()]);
    setEvents(eList);
    setContacts(cList);
    if (eList.length > 0 && !selectedEvent) {
      setSelectedEvent(eList[0]);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName || !eventDate) return;

    const newEv = await createEvent({
      eventName,
      description,
      eventDate,
      locationName,
      category,
    });

    setEvents([newEv, ...events]);
    setSelectedEvent(newEv);
    setShowAddEventModal(false);
    setEventName('');
    setDescription('');
  };

  const handleAddParticipant = async (contactId: number) => {
    if (!selectedEvent) return;
    const updated = await addParticipantToEvent(selectedEvent.id!, contactId);
    setSelectedEvent(updated);
    setEvents(events.map(ev => ev.id === updated.id ? updated : ev));
    setShowAddParticipantModal(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-7 h-7 text-indigo-600" />
            <span>Event-Based Connections</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Group contacts by event and answer: "Who did I meet at this event?"
          </p>
        </div>

        <button
          onClick={() => setShowAddEventModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Event</span>
        </button>
      </div>

      {/* Main Split View: Events List & Event Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events Navigation Column */}
        <div className="space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Select Event</h3>
          {events.map((ev) => (
            <div
              key={ev.id}
              onClick={() => setSelectedEvent(ev)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedEvent?.id === ev.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${selectedEvent?.id === ev.id ? 'bg-white/20 text-white' : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'}`}>
                  {ev.category}
                </span>
                <span className={`text-xs ${selectedEvent?.id === ev.id ? 'text-indigo-100' : 'text-slate-400'}`}>{ev.eventDate}</span>
              </div>
              <h4 className="font-bold text-base mt-2">{ev.eventName}</h4>
              <p className={`text-xs mt-1 flex items-center gap-1 ${selectedEvent?.id === ev.id ? 'text-indigo-100' : 'text-slate-500'}`}>
                <MapPin className="w-3.5 h-3.5" />
                <span>{ev.locationName}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Event Details & Connected Contacts */}
        {selectedEvent ? (
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase text-indigo-600">{selectedEvent.category}</span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{selectedEvent.eventName}</h2>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                  <span>📅 {selectedEvent.eventDate}</span>
                  <span>📍 {selectedEvent.locationName}</span>
                </p>
              </div>

              <button
                onClick={() => setShowAddParticipantModal(true)}
                className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 text-xs font-bold px-3.5 py-2 rounded-xl"
              >
                <UserPlus className="w-4 h-4" />
                <span>Link Contact</span>
              </button>
            </div>

            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Who did I meet at this event?</h3>
              <p className="text-xs text-slate-400 mb-4">Contacts connected to {selectedEvent.eventName}:</p>

              {(!selectedEvent.participants || selectedEvent.participants.length === 0) ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">No contacts linked to this event yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedEvent.participants.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => onSelectContact(p)}
                      className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-indigo-50/50 cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                          {p.fullName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-800 dark:text-white">{p.fullName}</h4>
                          <span className="text-[10px] font-bold text-indigo-600">{p.category}</span>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 font-semibold">View</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Modal: Create Event */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Create New Event</h3>
            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Event Name *</label>
                <input
                  type="text"
                  required
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g. AI Hackathon 2026"
                  className="w-full px-3 py-2 text-sm border rounded-xl bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-xl bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Venue / Location</label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="IIT Madras Research Park"
                  className="w-full px-3 py-2 text-sm border rounded-xl bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddEventModal(false)} className="px-4 py-2 text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl">
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Link Contact to Event */}
      {showAddParticipantModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Link Contact to Event</h3>
            <p className="text-xs text-slate-400">Select a contact to associate with {selectedEvent.eventName}:</p>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {contacts.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleAddParticipant(c.id!)}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer flex items-center justify-between"
                >
                  <span className="font-semibold text-sm">{c.fullName}</span>
                  <span className="text-xs text-indigo-600 font-bold">+ Link</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
