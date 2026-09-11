import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Compass, Shield, MapPin, EyeOff, Radio, Navigation, RefreshCw, Globe, CheckCircle } from 'lucide-react';
import { NearbyContact, Contact } from '../types';
import { fetchNearbyContacts, fetchContacts } from '../services/api';
import { WorldMapPickerModal } from '../components/common/WorldMapPickerModal';

interface NearbyContactsPageProps {
  onSelectContact: (contact: Contact) => void;
}

export const NearbyContactsPage: React.FC<NearbyContactsPageProps> = ({ onSelectContact }) => {
  // Default radius set to 50 km as requested
  const [radius, setRadius] = useState<number>(50);

  // User location state
  const [userLat, setUserLat] = useState<number>(13.0827);
  const [userLng, setUserLng] = useState<number>(80.2707);
  const [locationName, setLocationName] = useState<string>('Detecting GPS...');
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [showLocationPicker, setShowLocationPicker] = useState<boolean>(false);

  const [nearby, setNearby] = useState<NearbyContact[]>([]);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  // Request true browser device GPS location
  const detectLiveLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserLat(lat);
          setUserLng(lng);
          setIsGpsActive(true);
          setIsLocating(false);

          // Reverse geocode user location name
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            .then(res => res.json())
            .then(data => {
              if (data && data.display_name) {
                const parts = data.display_name.split(',');
                setLocationName(parts.length > 2 ? `${parts[0].trim()}, ${parts[parts.length - 1].trim()}` : data.display_name);
              } else {
                setLocationName(`Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`);
              }
            })
            .catch(() => setLocationName(`Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`));
        },
        (err) => {
          console.warn('Geolocation permission denied or unavailable:', err);
          setIsLocating(false);
          setIsGpsActive(false);
          setLocationName('GPS Unavailable (Using Selected City)');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setIsLocating(false);
      setIsGpsActive(false);
      setLocationName('GPS Not Supported (Using Selected City)');
    }
  };

  useEffect(() => {
    fetchContacts().then(setAllContacts);
    detectLiveLocation();
  }, []);

  // Fetch nearby contacts relative to userLat, userLng & radius
  useEffect(() => {
    setLoading(true);
    fetchNearbyContacts(userLat, userLng, radius).then((data) => {
      // Sort by distance ascending
      const sorted = [...data].sort((a, b) => a.approximateDistanceKm - b.approximateDistanceKm);
      setNearby(sorted);
      setLoading(false);
    });
  }, [userLat, userLng, radius]);

  // Render Leaflet Map centered on user's live position
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLat, userLng],
        zoom: 10,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      leafletMapRef.current = map;
    }

    const map = leafletMapRef.current;
    const allCoords: L.LatLngExpression[] = [[userLat, userLng]];

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // 1. Plot User Live Location Marker (Blue Pulsing Pin)
    const userIcon = L.divIcon({
      className: 'user-live-pin',
      html: `<div style="background-color: #3b82f6; width: 40px; height: 40px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 14px rgba(59,130,246,0.5); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px;">👤</div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const userMarker = L.marker([userLat, userLng], { icon: userIcon }).addTo(map);
    userMarker.bindPopup(`
      <div style="font-family: system-ui, sans-serif; padding: 4px;">
        <span style="background: #dbeafe; color: #1d4ed8; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px;">YOUR LIVE LOCATION</span>
        <h4 style="margin: 4px 0 0 0; font-weight: bold; font-size: 13px; color: #1e293b;">${locationName}</h4>
        <p style="font-size: 11px; color: #64748b; margin: 2px 0 0 0;">Scanning within ${radius} km radius</p>
      </div>
    `);

    // 2. Plot Nearby Contacts Markers (Green Pins)
    nearby.forEach((nb) => {
      if (nb.displayLatitude && nb.displayLongitude) {
        allCoords.push([nb.displayLatitude, nb.displayLongitude]);

        const contactIcon = L.divIcon({
          className: 'nearby-contact-pin',
          html: `<div style="background-color: #10b981; width: 34px; height: 34px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 13px;">🟢</div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const marker = L.marker([nb.displayLatitude, nb.displayLongitude], { icon: contactIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: system-ui, sans-serif; padding: 4px; min-width: 180px;">
            <span style="background: #d1fae5; color: #047857; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px;">🟢 ~${nb.approximateDistanceKm} KM AWAY</span>
            <h4 style="margin: 4px 0 2px 0; font-weight: bold; font-size: 14px; color: #0f172a;">${nb.fullName}</h4>
            <p style="font-size: 11px; color: #475569; margin: 0 0 4px 0;">Area: <b>${nb.approximateArea}</b></p>
            <p style="font-size: 10px; color: #94a3b8; margin: 0 0 6px 0; italic;">Exact address protected by Privacy Shield</p>
          </div>
        `);
      }
    });

    // Auto-fit map viewport bounds to cover user + all nearby contacts within 50km
    if (allCoords.length > 0) {
      const bounds = L.latLngBounds(allCoords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }

    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [userLat, userLng, nearby, radius, locationName]);

  const privateContacts = allContacts.filter(c => c.privacyLevel === 'PRIVATE' || c.allowNearbyDiscovery === false);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-7 h-7 text-emerald-500 animate-spin-slow" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">People Near Me</h1>
            <span className="bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 text-xs font-bold px-2 py-0.5 rounded-md">
              Live Device Location
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Discover contacts around your current live device GPS location up to 50 km and beyond with privacy protection.
          </p>
        </div>

        {/* Live Geolocation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={detectLiveLocation}
            disabled={isLocating}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Use My Live Device GPS'}</span>
          </button>

          <button
            onClick={() => setShowLocationPicker(true)}
            className="flex items-center gap-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl hover:border-emerald-500 transition-all shadow-sm"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-500" />
            <span>Set Custom Location</span>
          </button>
        </div>
      </div>

      {/* Live Location Status Indicator Banner */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${isGpsActive ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-amber-100 dark:bg-amber-950 text-amber-600'}`}>
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                Current Reference Point: {locationName}
              </span>
              {isGpsActive && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900">
                  <CheckCircle className="w-3 h-3" /> Live Device GPS
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Coordinates: Lat {userLat.toFixed(5)}, Lng {userLng.toFixed(5)}
            </p>
          </div>
        </div>
      </div>

      {/* Discovery Radius Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-indigo-600" />
              <span>Proximity Search Radius (up to 50 km)</span>
            </h3>
            <p className="text-xs text-slate-400">Select distance radius to scan for nearby contacts relative to your location</p>
          </div>

          {/* Radius Selector Pills including 50km */}
          <div className="flex flex-wrap items-center gap-2">
            {[5, 15, 30, 50, 100, 500, 10000].map((r) => (
              <button
                key={r}
                onClick={() => setRadius(r)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  radius === r
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {r >= 10000 ? 'All Worldwide' : `${r} km`}
              </button>
            ))}
          </div>
        </div>

        {/* Privacy Banner */}
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300">
          <Shield className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="leading-relaxed">
            <span className="font-bold">Privacy Guarantee:</span> Distances are calculated accurately using spherical Haversine formulas. Exact home street numbers remain strictly protected by privacy centroids.
          </p>
        </div>
      </div>

      {/* Proximity Leaflet Map Frame */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs px-2 text-slate-500">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            🗺️ Proximity Map centered on your location (Showing contacts within {radius >= 10000 ? 'All Worldwide' : `${radius} km`})
          </span>
          <span className="text-emerald-600 font-bold">Blue Pin = You | Green Pins = Contacts</span>
        </div>

        <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800 relative z-0">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>
      </div>

      {/* Discoverable Contacts Grid */}
      <div>
        <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center justify-between">
          <span>Contacts within {radius >= 10000 ? 'All Worldwide' : `${radius} km`} ({nearby.length})</span>
          <span className="text-xs font-normal text-slate-400">Sorted by closest distance</span>
        </h3>

        {nearby.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-700 dark:text-slate-300">No contacts found within {radius} km</h4>
            <p className="text-xs text-slate-400 mt-1">Try expanding the discovery radius to 50 km or 100 km.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nearby.map((nb) => (
              <div
                key={nb.contactId}
                onClick={() => {
                  const found = allContacts.find(c => c.id === nb.contactId);
                  if (found) onSelectContact(found);
                }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-emerald-500 transition-all cursor-pointer shadow-sm group hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                      {nb.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-emerald-600 transition-colors">
                        {nb.fullName}
                      </h4>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {nb.category}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-900 shrink-0">
                    🟢 ~{nb.approximateDistanceKm} km away
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>Area: {nb.approximateArea}</span>
                  </span>
                  <span className="text-slate-400 text-[11px] italic">Exact Home Protected</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hidden / Private Contacts Notice */}
      {privateContacts.length > 0 && (
        <div className="bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-slate-400" />
            <span>Contacts with Location Hidden by Privacy Settings ({privateContacts.length})</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {privateContacts.map((pc) => (
              <span
                key={pc.id}
                onClick={() => onSelectContact(pc)}
                className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer hover:border-slate-400 transition-all"
              >
                🔒 {pc.fullName} ({pc.category}) — Location Hidden
              </span>
            ))}
          </div>
        </div>
      )}

      {/* World Map Location Picker Modal */}
      {showLocationPicker && (
        <WorldMapPickerModal
          initialLat={userLat}
          initialLng={userLng}
          initialArea={locationName}
          onClose={() => setShowLocationPicker(false)}
          onConfirm={({ lat, lng, area }) => {
            setUserLat(lat);
            setUserLng(lng);
            setLocationName(area);
            setIsGpsActive(false);
          }}
        />
      )}
    </div>
  );
};
