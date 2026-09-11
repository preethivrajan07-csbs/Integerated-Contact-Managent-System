import React, { useState, useEffect } from 'react';
import { Bell, Check, Calendar, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { NotificationItem } from '../types';
import { fetchNotifications, markNotificationRead } from '../services/api';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    fetchNotifications().then(setNotifications);
  }, []);

  const handleMarkRead = async (id: number) => {
    await markNotificationRead(id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-7 h-7 text-indigo-600" />
          <span>System Notifications & Reminders</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Event alerts, follow-up reminders, and privacy setting updates.
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
              n.isRead
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                : 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900 text-slate-900 dark:text-white shadow-sm'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-600 text-white mt-0.5">
                {n.type === 'EVENT_REMINDER' && <Calendar className="w-4 h-4" />}
                {n.type === 'PRIVACY_ALERT' && <Shield className="w-4 h-4" />}
                {n.type === 'FOLLOWUP_REMINDER' && <Bell className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="font-bold text-sm">{n.title}</h4>
                <p className="text-xs mt-0.5 opacity-90">{n.message}</p>
                <span className="text-[10px] text-slate-400 mt-2 block">{n.createdAt?.split('T')[0]}</span>
              </div>
            </div>

            {!n.isRead && (
              <button
                onClick={() => handleMarkRead(n.id)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border"
              >
                Mark Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
