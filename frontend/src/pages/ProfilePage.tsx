import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, MapPin, Phone, Globe, Save, CheckCircle, Lock } from 'lucide-react';
import { UserProfile, PrivacyLevel } from '../types';
import { WorldMapPickerModal } from '../components/common/WorldMapPickerModal';

interface ProfilePageProps {
  currentUser: UserProfile | null;
  onUpdateProfile: (updatedUser: UserProfile) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, onUpdateProfile }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [cityArea, setCityArea] = useState('');
  const [latitude, setLatitude] = useState<number>(13.0827);
  const [longitude, setLongitude] = useState<number>(80.2707);
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>('APPROXIMATE');
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showWorldMapPicker, setShowWorldMapPicker] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || '');
      setPhoneNumber(currentUser.phoneNumber || '');
      setEmail(currentUser.email || '');
      setAddress(currentUser.address || '');
      setCityArea(currentUser.cityArea || 'Chennai Area');
      setLatitude(currentUser.latitude || 13.0827);
      setLongitude(currentUser.longitude || 80.2707);
      setPrivacyLevel(currentUser.privacyLevel || 'APPROXIMATE');
    }
  }, [currentUser]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber) return;

    const updated: UserProfile = {
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

    localStorage.setItem('icms_user_session', JSON.stringify(updated));
    onUpdateProfile(updated);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (!currentUser) {
    return (
      <div className="p-12 text-center text-slate-500">
        No active user logged in. Please log in first.
      </div>
    );
  }

  const initialLetter = fullName.trim() ? fullName.trim().charAt(0).toUpperCase() : 'U';

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto animate-fadeIn">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-7 h-7 text-indigo-600" />
            <span>Active User Profile & Account Settings</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Logged-in user profile details and location privacy configuration.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
            isEditing
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isEditing ? 'Cancel Edit' : 'Edit Profile Details'}
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle className="w-4 h-4" />
          <span>User profile successfully updated and synchronized across ICMS!</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        {/* User Initial Badge Hero Banner */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-600 text-white font-extrabold text-4xl flex items-center justify-center shadow-xl shadow-indigo-600/30 shrink-0">
            {initialLetter}
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{fullName}</h2>
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                Active Session
              </span>
            </div>

            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center justify-center sm:justify-start gap-1">
              <Shield className="w-3.5 h-3.5" />
              <span>ICMS Registered Account Owner • Initial Badge [{initialLetter}]</span>
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> {phoneNumber}
              </span>
              {email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {email}
                </span>
              )}
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> {cityArea}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Read/Edit Form */}
        {!isEditing ? (
          /* View Mode */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Full Address / Workplace
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {address || 'Not specified'}
              </span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Display City / Area
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>{cityArea}</span>
              </span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Privacy Protection Level
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>{privacyLevel} (Fuzzy Centroid Active)</span>
              </span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60 sm:col-span-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                World Coordinates (Latitude, Longitude)
              </span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">
                Lat: {latitude.toFixed(5)}, Lng: {longitude.toFixed(5)}
              </span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Account Status
              </span>
              <span className="font-bold text-emerald-600 text-xs flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Authenticated Session
              </span>
            </div>
          </div>
        ) : (
          /* Edit Mode Form */
          <form onSubmit={handleSave} className="space-y-4 animate-fadeIn">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Edit User Identity Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Privacy Level
                </label>
                <select
                  value={privacyLevel}
                  onChange={(e) => setPrivacyLevel(e.target.value as PrivacyLevel)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <option value="APPROXIMATE">APPROXIMATE (Hide exact house address)</option>
                  <option value="PRIVATE">PRIVATE (Hidden from nearby map scan)</option>
                  <option value="PUBLIC">PUBLIC (Discoverable)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Address / Workplace
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Display City / Area
                </label>
                <input
                  type="text"
                  value={cityArea}
                  onChange={(e) => setCityArea(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  World Coordinates
                </label>
                <button
                  type="button"
                  onClick={() => setShowWorldMapPicker(true)}
                  className="w-full px-3 py-2 text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Pick World Map Location (Lat: {latitude.toFixed(3)}, Lng: {longitude.toFixed(3)})</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save Updated Profile</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* World Map Location Picker Modal */}
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
