import React from 'react';
import { AlertTriangle, GitMerge, RefreshCw, X } from 'lucide-react';
import { Contact } from '../../types';

interface DuplicateResolutionModalProps {
  existingContact: Contact;
  incomingContact: Partial<Contact>;
  matchedBy: string;
  onMerge: () => void;
  onReplace: () => void;
  onCancel: () => void;
}

export const DuplicateResolutionModal: React.FC<DuplicateResolutionModalProps> = ({
  existingContact,
  incomingContact,
  matchedBy,
  onMerge,
  onReplace,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        {/* Header Alert */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Possible Duplicate Contact Found
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              A contact matching the specified <span className="font-semibold text-amber-600 dark:text-amber-400">{matchedBy.toLowerCase()}</span> already exists in your database.
            </p>
          </div>
        </div>

        {/* Side by side comparison */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Existing Record</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-1">{existingContact.fullName}</p>
            <p className="text-slate-500">{existingContact.phoneNumber}</p>
            <p className="text-slate-500">{existingContact.email || 'No Email'}</p>
            <span className="inline-block bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold px-2 py-0.5 rounded text-[10px] mt-2">
              {existingContact.category}
            </span>
          </div>

          <div className="border-l border-slate-200 dark:border-slate-700 pl-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">Incoming Record</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-1">{incomingContact.fullName}</p>
            <p className="text-slate-500">{incomingContact.phoneNumber}</p>
            <p className="text-slate-500">{incomingContact.email || 'No Email'}</p>
            <span className="inline-block bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded text-[10px] mt-2">
              {incomingContact.category}
            </span>
          </div>
        </div>

        {/* Action Choices: MERGE, REPLACE, CANCEL */}
        <div className="space-y-2 pt-2">
          <button
            onClick={onMerge}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-600 text-white">
                <GitMerge className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-sm text-indigo-900 dark:text-indigo-200">MERGE (Recommended)</p>
                <p className="text-xs text-indigo-700 dark:text-indigo-300">Combine missing fields & timeline history into existing contact</p>
              </div>
            </div>
          </button>

          <button
            onClick={onReplace}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">REPLACE</p>
                <p className="text-xs text-slate-500">Overwrite old contact info with this new information</p>
              </div>
            </div>
          </button>

          <button
            onClick={onCancel}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition-all mt-2"
          >
            <X className="w-4 h-4" />
            <span>Cancel Operation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
