import React, { useState, useEffect } from 'react';
import { X, Save, MapPin, Shield, User, Phone, Mail, Tag, Navigation, Compass, Globe } from 'lucide-react';
import { Contact, Category, PrivacyLevel } from '../../types';
import { checkDuplicateContact, createContact, updateContact, mergeContacts } from '../../services/api';
import { DuplicateResolutionModal } from './DuplicateResolutionModal';
import { geocodeLocation } from '../../utils/geocoding';
import { WorldMapPickerModal } from '../common/WorldMapPickerModal';

interface ContactFormModalProps {
  contactToEdit?: Contact | null;
  onClose: () => void;
  onSaved: () => void;
}

export const ContactFormModal: React.FC<ContactFormModalProps> = ({ contactToEdit, onClose, onSaved }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<Category>('PROFESSIONAL');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [homeLatitude, setHomeLatitude] = useState<number>(13.0827);
  const [homeLongitude, setHomeLongitude] = useState<number>(80.2707);
  const [homeCityArea, setHomeCityArea] = useState('Chennai Central');
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>('APPROXIMATE');
  const [allowNearbyDiscovery, setAllowNearbyDiscovery] = useState(true);

  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeNotice, setGeocodeNotice] = useState('');
  const [showWorldMapPicker, setShowWorldMapPicker] = useState(false);

  // Duplicate state
  const [duplicateMatch, setDuplicateMatch] = useState<{
    existingContact: Contact;
    matchedBy: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (contactToEdit) {
      setFullName(contactToEdit.fullName || '');
      setPhoneNumber(contactToEdit.phoneNumber || '');
      setEmail(contactToEdit.email || '');
      setCategory(contactToEdit.category || 'OTHER');
      setAddress(contactToEdit.address || '');
      setNotes(contactToEdit.notes || '');
      setHomeLatitude(contactToEdit.homeLatitude || 13.0827);
      setHomeLongitude(contactToEdit.homeLongitude || 80.2707);
      setHomeCityArea(contactToEdit.homeCityArea || 'Chennai Area');
      setPrivacyLevel(contactToEdit.privacyLevel || 'APPROXIMATE');
      setAllowNearbyDiscovery(contactToEdit.allowNearbyDiscovery ?? true);
    }
  }, [contactToEdit]);

  // Handle City / Area input change with live global geocoding
  const handleCityAreaChange = async (value: string) => {
    setHomeCityArea(value);
    if (value.length > 2) {
      const coords = await geocodeLocation(value);
      if (coords) {
        setHomeLatitude(coords.lat);
        setHomeLongitude(coords.lng);
        setGeocodeNotice(`Geocoded location for "${value}": Lat ${coords.lat.toFixed(4)}, Lng ${coords.lng.toFixed(4)}`);
      }
    }
  };

  const handleManualGeocode = async () => {
    setIsGeocoding(true);
    setGeocodeNotice('');
    const query = homeCityArea || address;
    const result = await geocodeLocation(query);
    if (result) {
      setHomeLatitude(result.lat);
      setHomeLongitude(result.lng);
      setGeocodeNotice(`Found global coordinates for "${query}": Lat ${result.lat.toFixed(4)}, Lng ${result.lng.toFixed(4)}`);
    } else {
      setGeocodeNotice(`Could not auto-find coordinates for "${query}". You can use the World Map Picker below.`);
    }
    setIsGeocoding(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber) return;

    setIsSubmitting(true);
    try {
      const payload: Partial<Contact> = {
        fullName,
        phoneNumber,
        email,
        category,
        address,
        notes,
        homeLatitude: Number(homeLatitude),
        homeLongitude: Number(homeLongitude),
        homeCityArea,
        privacyLevel,
        allowNearbyDiscovery,
      };

      if (contactToEdit && contactToEdit.id) {
        await updateContact(contactToEdit.id, payload);
        onSaved();
      } else {
        // Check for duplicates before creating
        const dupCheck = await checkDuplicateContact(phoneNumber, email);
        if (dupCheck.duplicate && dupCheck.existingContact) {
          setDuplicateMatch({
            existingContact: dupCheck.existingContact,
            matchedBy: dupCheck.matchedBy || 'PHONE',
          });
          setIsSubmitting(false);
          return;
        }

        await createContact(payload, false);
        onSaved();
      }
    } catch (err) {
      console.error('Failed to save contact', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMergeDuplicate = async () => {
    if (!duplicateMatch) return;
    setIsSubmitting(true);
    try {
      await mergeContacts(duplicateMatch.existingContact.id!, {
        fullName,
        phoneNumber,
        email,
        category,
        address,
        notes,
      });
      onSaved();
    } catch (err) {
      console.error('Merge failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplaceDuplicate = async () => {
    if (!duplicateMatch) return;
    setIsSubmitting(true);
    try {
      await updateContact(duplicateMatch.existingContact.id!, {
        fullName,
        phoneNumber,
        email,
        category,
        address,
        notes,
        homeLatitude: Number(homeLatitude),
        homeLongitude: Number(homeLongitude),
        homeCityArea,
        privacyLevel,
        allowNearbyDiscovery,
      });
      onSaved();
    } catch (err) {
      console.error('Replace failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
          {/* Modal Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              <span>{contactToEdit ? 'Edit Contact' : 'Add New Intelligence Contact'}</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Basic Information */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
                1. Personal Identification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ravi Kumar"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ravi@example.com"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <div className="relative">
                    <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                    >
                      <option value="FAMILY">FAMILY</option>
                      <option value="FRIEND">FRIEND</option>
                      <option value="OFFICE">OFFICE</option>
                      <option value="DOCTOR">DOCTOR</option>
                      <option value="EMERGENCY">EMERGENCY</option>
                      <option value="COLLEGE">COLLEGE</option>
                      <option value="PROFESSIONAL">PROFESSIONAL</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Address & Context Notes */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
                2. Context & Notes
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Address / Workplace (e.g. Any address or location in the world)
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (!homeCityArea || homeCityArea === 'Chennai Central' || homeCityArea === 'Chennai Area') {
                        handleCityAreaChange(e.target.value);
                      }
                    }}
                    placeholder="e.g. Paris, Tokyo, London, New York, Vellore, Krishnagiri, Ambur..."
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Context Notes (How you met, skills, details)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Met at technical conference. Skilled in React & Java..."
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* Global World Location & Privacy Section */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                <span>3. Global Location & Privacy Protection</span>
              </h3>

              <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl space-y-4">
                {/* World Map Location Picker Trigger */}
                <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600">
                      <Globe className="w-5 h-5 animate-spin-slow" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        Interactive World Map Picker
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Click anywhere on earth or search any city/country in the world.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowWorldMapPicker(true)}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95 shrink-0"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Open World Map Picker</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Display Area / City (Any place in the world)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={homeCityArea}
                        onChange={(e) => handleCityAreaChange(e.target.value)}
                        placeholder="e.g. Tokyo, Paris, New York, Vellore, Krishnagiri..."
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={handleManualGeocode}
                        disabled={isGeocoding}
                        className="px-3 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shrink-0 flex items-center gap-1"
                        title="Auto-detect coordinates"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>{isGeocoding ? 'Finding...' : 'Geocode'}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Privacy Level
                    </label>
                    <select
                      value={privacyLevel}
                      onChange={(e) => setPrivacyLevel(e.target.value as PrivacyLevel)}
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    >
                      <option value="APPROXIMATE">APPROXIMATE (Fuzzy centroid only)</option>
                      <option value="PRIVATE">PRIVATE (Hidden from nearby discovery)</option>
                      <option value="PUBLIC">PUBLIC (Discoverable)</option>
                    </select>
                  </div>
                </div>

                {/* Visible & Editable Geocoded Latitude / Longitude Fields */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-emerald-200/50 dark:border-emerald-900/40">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Latitude (Worldwide)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={homeLatitude}
                      onChange={(e) => setHomeLatitude(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Longitude (Worldwide)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={homeLongitude}
                      onChange={(e) => setHomeLongitude(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                    />
                  </div>
                </div>

                {geocodeNotice && (
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium italic">
                    ℹ️ {geocodeNotice}
                  </p>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="allowNearby"
                    checked={allowNearbyDiscovery}
                    onChange={(e) => setAllowNearbyDiscovery(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="allowNearby" className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    Allow inclusion in "People Near Me" approximate discovery radius
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-5 py-2 rounded-xl shadow-md shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving...' : 'Save Contact'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Interactive World Map Picker Modal */}
      {showWorldMapPicker && (
        <WorldMapPickerModal
          initialLat={homeLatitude}
          initialLng={homeLongitude}
          initialArea={homeCityArea}
          onClose={() => setShowWorldMapPicker(false)}
          onConfirm={({ lat, lng, area }) => {
            setHomeLatitude(lat);
            setHomeLongitude(lng);
            setHomeCityArea(area);
            setGeocodeNotice(`Selected location on world map: ${area} (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
          }}
        />
      )}

      {/* Render Duplicate Resolution Modal if duplicate detected */}
      {duplicateMatch && (
        <DuplicateResolutionModal
          existingContact={duplicateMatch.existingContact}
          incomingContact={{ fullName, phoneNumber, email, category, address, notes }}
          matchedBy={duplicateMatch.matchedBy}
          onMerge={handleMergeDuplicate}
          onReplace={handleReplaceDuplicate}
          onCancel={() => setDuplicateMatch(null)}
        />
      )}
    </>
  );
};
