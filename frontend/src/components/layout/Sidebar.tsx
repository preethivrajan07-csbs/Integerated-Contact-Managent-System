import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  History, 
  MapPin, 
  Compass, 
  Sparkles, 
  GitFork, 
  BarChart3, 
  Bell, 
  ShieldCheck, 
  User, 
  Settings,
  Shield,
  Layers
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadNotificationCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, unreadNotificationCount }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'events', label: 'Events & Groups', icon: Calendar },
    { id: 'timeline', label: 'Contact Timeline', icon: History },
    { id: 'map', label: 'Interactive Map', icon: MapPin },
    { id: 'nearby', label: 'People Near Me', icon: Compass, badge: 'Privacy' },
    { id: 'suggestions', label: 'Smart Suggestions', icon: Sparkles, highlight: true },
    { id: 'graph', label: 'Relationship Graph', icon: GitFork },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: unreadNotificationCount },
    { id: 'privacy', label: 'Privacy Settings', icon: ShieldCheck },
    { id: 'profile', label: 'User Profile', icon: User },
    { id: 'settings', label: 'App Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen shrink-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
          <Layers className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white tracking-wide leading-none">ICMS</h1>
          <p className="text-xs text-indigo-400 font-medium mt-1">Contact Intelligence</p>
        </div>
      </div>

      {/* Tagline */}
      <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/80 text-[11px] text-slate-400 font-medium tracking-tight">
        Remember People • Places • Context
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.count ? (
                <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              ) : null}
              {item.badge ? (
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Privacy Guarantee Footer */}
      <div className="p-4 m-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
          <Shield className="w-4 h-4" />
          <span>Privacy Shield Active</span>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          Home coordinates protected. Only approximate region centroids are discoverable.
        </p>
      </div>
    </aside>
  );
};
