import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  History, 
  Edit, 
  Trash2, 
  Plus, 
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Award,
  Layers
} from 'lucide-react';
import { Contact, Interaction, MeetingLocation } from '../types';
import { addInteractionToContact, deleteContact } from '../services/api';

interface ContactDetailsPageProps {
  contact: Contact;
  onBack: () => void;
  onEdit: (contact: Contact) => void;
  onDeleted: () => void;
}

export const ContactDetailsPage: React.FC<ContactDetailsPageProps> = ({
  contact,
  onBack,
  onEdit,
  onDeleted,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'interactions' | 'events' | 'locations' | 'analytics'>('overview');
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [interactionType, setInteractionType] = useState<any>('MEETING');
  const [interactionNotes, setInteractionNotes] = useState('');
  const [interactionLocation, setInteractionLocation] = useState('');
  const [localContact, setLocalContact] = useState<Contact>(contact);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete contact "${localContact.fullName}"?`)) {
      await deleteContact(localContact.id!);
      onDeleted();
    }
  };

  const handleAddInteraction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interactionNotes) return;

    const newInter = await addInteractionToContact(localContact.id!, {
      interactionType,
      notes: interactionNotes,
      locationName: interactionLocation || undefined,
      interactionDate: new Date().toISOString(),
    });

    const updatedInteractions = [newInter, ...(localContact.interactions || [])];
    const updatedScore = Math.min(100, (localContact.relationshipScore || 50) + 5);

    setLocalContact({
      ...localContact,
      interactions: updatedInteractions,
      relationshipScore: updatedScore,
    });

    setShowInteractionModal(false);
    setInteractionNotes('');
    setInteractionLocation('');
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto animate-fadeIn">
      {/* Top Navigation */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Contact Directory</span>
      </button>

      {/* Header Profile Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg shrink-0">
              {localContact.fullName.trim() ? localContact.fullName.trim().charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{localContact.fullName}</h1>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {localContact.category}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {localContact.phoneNumber}
                </span>
                {localContact.email && (
                  <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {localContact.email}
                  </span>
                )}
                {localContact.homeCityArea && (
                  <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {localContact.homeCityArea}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Score & Controls */}
          <div className="flex flex-col md:items-end gap-3">
            <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 p-3 rounded-2xl">
              <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Relationship Strength</p>
                <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-none mt-0.5">
                  {localContact.relationshipScore || 50} / 100
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(localContact)}
                className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold text-xs px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 transition-all"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 font-semibold text-xs px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/40 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-200 dark:border-slate-800 mt-6 pt-4 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'timeline', label: 'Timeline History' },
            { id: 'interactions', label: 'Interactions' },
            { id: 'events', label: 'Events' },
            { id: 'locations', label: 'Meeting Places' },
            { id: 'analytics', label: 'Score Breakdown' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Context Notes</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              {localContact.notes || 'No contextual notes recorded.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Location Privacy Shield Status</span>
            </h3>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Privacy Level:</span>
                <span className="font-bold text-emerald-600">{localContact.privacyLevel || 'APPROXIMATE'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Approximate Region:</span>
                <span className="font-semibold">{localContact.homeCityArea || 'Chennai Area'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nearby Discovery:</span>
                <span className="font-semibold">{localContact.allowNearbyDiscovery ? 'Enabled' : 'Disabled'}</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                Exact home coordinates are hidden from external users.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Living History Timeline</h3>
          <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 pl-8">
            {(localContact.interactions || []).map((inter, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white dark:border-slate-900" />
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-indigo-600">{inter.interactionType}</span>
                    <span className="text-[11px] text-slate-400">{inter.interactionDate?.split('T')[0]}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1">{inter.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Interactions */}
      {activeTab === 'interactions' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Interaction Log</h3>
            <button
              onClick={() => setShowInteractionModal(true)}
              className="flex items-center gap-1.5 bg-indigo-600 text-white font-semibold text-xs px-3.5 py-2 rounded-xl"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log New Interaction</span>
            </button>
          </div>

          <div className="space-y-3">
            {(localContact.interactions || []).map((inter, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span className="text-indigo-600 font-bold">{inter.interactionType}</span>
                  <span>{inter.interactionDate?.split('T')[0]}</span>
                </div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1">{inter.notes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Events */}
      {activeTab === 'events' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Connected Events</h3>
          <p className="text-xs text-slate-500">Which events did you attend together with {localContact.fullName}?</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-indigo-200/60 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/30">
              <span className="text-[10px] font-bold uppercase text-indigo-600">Event Participant</span>
              <h4 className="font-bold text-sm text-slate-800 dark:text-white mt-1">AI Hackathon 2026</h4>
              <p className="text-xs text-slate-500 mt-1">IIT Madras Research Park • Aug 15, 2026</p>
            </div>
            <div className="p-4 rounded-xl border border-indigo-200/60 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/30">
              <span className="text-[10px] font-bold uppercase text-indigo-600">Event Participant</span>
              <h4 className="font-bold text-sm text-slate-800 dark:text-white mt-1">Chennai Tech Conference 2026</h4>
              <p className="text-xs text-slate-500 mt-1">Chennai Trade Centre • Aug 10, 2026</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Meeting Locations */}
      {activeTab === 'locations' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-500" />
            <span>Where Did I Meet {localContact.fullName}?</span>
          </h3>

          <div className="space-y-3">
            {(localContact.meetingLocations || []).map((loc, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">{loc.locationName}</h4>
                  <span className="text-xs text-slate-400">{loc.meetingDate}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{loc.description}</p>
                {loc.relatedEventName && (
                  <span className="inline-block mt-2 text-[10px] font-semibold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
                    Related Event: {loc.relatedEventName}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Interaction */}
      {showInteractionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Log Interaction</h3>
            <form onSubmit={handleAddInteraction} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Type</label>
                <select
                  value={interactionType}
                  onChange={(e) => setInteractionType(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl"
                >
                  <option value="MEETING">MEETING</option>
                  <option value="CALL">CALL</option>
                  <option value="EMAIL">EMAIL</option>
                  <option value="MESSAGE">MESSAGE</option>
                  <option value="EVENT">EVENT</option>
                  <option value="PROJECT_DISCUSSION">PROJECT_DISCUSSION</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                <textarea
                  required
                  rows={3}
                  value={interactionNotes}
                  onChange={(e) => setInteractionNotes(e.target.value)}
                  placeholder="Discussion details..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInteractionModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
