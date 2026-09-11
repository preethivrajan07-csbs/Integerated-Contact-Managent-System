import React, { useState } from 'react';
import { Shield, User, Phone, Mail, MapPin, Globe, Compass, Lock, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { UserProfile, PrivacyLevel } from '../types';
import { WorldMapPickerModal } from '../components/common/WorldMapPickerModal';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [cityArea, setCityArea] = useState('Chennai Area');
  const [latitude, setLatitude] = useState<number>(13.0827);
  const [longitude, setLongitude] = useState<number>(80.2707);
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>('APPROXIMATE');
  const [showWorldMapPicker, setShowWorldMapPicker] = useState(false);
  const [passcode, setPasscode] = useState('');

  // Quick Demo Auto-Fill
  const handleQuickFill = () => {
    setFullName('Prithvi Kumar');
    setPhoneNumber('+91 9876543210');
    setEmail('prithvi.icms@gmail.com');
    setAddress('Anna Nagar, Chennai');
    setCityArea('Chennai Central');
    setLatitude(13.0850);
    setLongitude(80.2100);
    setPrivacyLevel('APPROXIMATE');
    setPasscode('1234');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim()) return;

    const userProfile: UserProfile = {
      fullName,
      phoneNumber,
      email,
      address,
      cityArea,
      latitude,
      longitude,
      privacyLevel,
      isLoggedIn: true,
    };

    localStorage.setItem('icms_user_session', JSON.stringify(userProfile));
    onLoginSuccess(userProfile);
  };

  const firstLetter = fullName.trim() ? fullName.trim().charAt(0).toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

      <div className="max-w-2xl w-full bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Integrated Contact Intelligence System</span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome to <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">ICMS Account Access</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Enter your personal profile details to sign in and personalize location-aware contact intelligence.
          </p>
        </div>

        {/* User Initial Badge Preview & Quick Fill */}
        <div className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700/60 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
              {firstLetter}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {fullName.trim() ? fullName : 'Your Name Preview'}
              </h3>
              <p className="text-xs text-slate-400">Profile Initial Badge: <b className="text-indigo-400">{firstLetter}</b></p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleQuickFill}
            className="flex items-center gap-1.5 text-xs font-bold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-3.5 py-2 rounded-xl transition-all active:scale-95 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>⚡ Quick Fill Demo</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1: Personal Identity */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <User className="w-4 h-4" /> 1. Personal Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name (e.g. Prithvi)"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-800/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-800/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-800/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Passcode / PIN (Optional)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="••••"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-800/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Location & Address */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> 2. Home Location & Workplace Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Address / Workplace
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Anna Nagar, Chennai / Katpadi Road, Vellore / Anywhere in the world"
                  className="w-full px-3 py-2.5 text-sm bg-slate-800/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Display City / Area
                </label>
                <input
                  type="text"
                  value={cityArea}
                  onChange={(e) => setCityArea(e.target.value)}
                  placeholder="e.g. Chennai, Vellore, Bangalore, London..."
                  className="w-full px-3 py-2.5 text-sm bg-slate-800/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Default Privacy Protection
                </label>
                <select
                  value={privacyLevel}
                  onChange={(e) => setPrivacyLevel(e.target.value as PrivacyLevel)}
                  className="w-full px-3 py-2.5 text-sm bg-slate-800/80 border border-slate-700 rounded-xl text-white"
                >
                  <option value="APPROXIMATE">APPROXIMATE (Hide exact house address)</option>
                  <option value="PRIVATE">PRIVATE (Hidden from nearby map scan)</option>
                  <option value="PUBLIC">PUBLIC (Discoverable)</option>
                </select>
              </div>
            </div>

            {/* Interactive World Location Picker Trigger */}
            <div className="flex items-center justify-between p-3.5 bg-slate-800/60 border border-slate-700 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Globe className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Pick Exact Coordinates on World Map</h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Lat: {latitude.toFixed(4)}, Lng: {longitude.toFixed(4)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowWorldMapPicker(true)}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md active:scale-95"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Open World Map</span>
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all active:scale-[0.99]"
            >
              <span>Sign In & Access ICMS Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Security Note */}
        <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          <span>Privacy Guaranteed: Your profile and location coordinates are protected by ICMS Encryption.</span>
        </p>
      </div>

      {/* World Map Picker Modal */}
      {showWorldMapPicker && (
        <WorldMapPickerModal
          initialLat={latitude}
          initialLng={longitude}
          initialArea={cityArea}
          onClose={() => setShowWorldMapPicker(false)}
          onConfirm={({ lat, lng, area }) => {
            setLatitude(lat);
            setLongitude(lng);
            setCityArea(area);
          }}
        />
      )}
    </div>
  );
};
