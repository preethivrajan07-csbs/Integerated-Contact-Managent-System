import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, Search, MapPin, Check, Globe, Navigation, Loader2 } from 'lucide-react';

interface WorldMapPickerModalProps {
  initialLat?: number;
  initialLng?: number;
  initialArea?: string;
  onClose: () => void;
  onConfirm: (location: { lat: number; lng: number; area: string }) => void;
}

export const WorldMapPickerModal: React.FC<WorldMapPickerModalProps> = ({
  initialLat = 13.0827,
  initialLng = 80.2707,
  initialArea = '',
  onClose,
  onConfirm,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [selectedLat, setSelectedLat] = useState<number>(initialLat);
  const [selectedLng, setSelectedLng] = useState<number>(initialLng);
  const [selectedArea, setSelectedArea] = useState<string>(initialArea || 'Selected Location');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  // Debounced live global search via OpenStreetMap Nominatim API
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`,
          { headers: { 'User-Agent': 'ICMS-WorldMapPicker/1.0' } }
        );
        const data = await res.json();
        setSearchResults(data || []);
      } catch (err) {
        console.error('Global search error', err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reverse geocoding on lat/lng change
  const performReverseGeocode = async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=12`,
        { headers: { 'User-Agent': 'ICMS-WorldMapPicker/1.0' } }
      );
      const data = await res.json();
      if (data && data.display_name) {
        const parts = data.display_name.split(',');
        const areaName = parts.length > 2 ? `${parts[0].trim()}, ${parts[parts.length - 1].trim()}` : data.display_name;
        setSelectedArea(areaName);
      }
    } catch (err) {
      console.warn('Reverse geocode error', err);
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  // Update map pin position
  const updatePinPosition = (lat: number, lng: number, fly = true, areaName?: string) => {
    setSelectedLat(lat);
    setSelectedLng(lng);
    if (areaName) setSelectedArea(areaName);

    if (leafletMapRef.current) {
      const map = leafletMapRef.current;

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        const customIcon = L.divIcon({
          className: 'custom-picker-pin',
          html: `<div style="background-color: #4f46e5; width: 36px; height: 36px; border-radius: 50%; border: 3.5px solid white; box-shadow: 0 4px 14px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px;">📍</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });
        markerRef.current = L.marker([lat, lng], { icon: customIcon, draggable: true }).addTo(map);

        markerRef.current.on('dragend', (event) => {
          const newPos = event.target.getLatLng();
          setSelectedLat(newPos.lat);
          setSelectedLng(newPos.lng);
          performReverseGeocode(newPos.lat, newPos.lng);
        });
      }

      if (fly) {
        map.flyTo([lat, lng], 13, { duration: 1 });
      }
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: initialLat === 13.0827 ? 3 : 11, // Global view if default, or zoomed in
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      leafletMapRef.current = map;

      // Handle map clicks anywhere on earth
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        updatePinPosition(lat, lng, false);
        performReverseGeocode(lat, lng);
      });
    }

    updatePinPosition(initialLat, initialLng, false);

    setTimeout(() => {
      leafletMapRef.current?.invalidateSize();
    }, 200);
  }, []);

  const handleSearchResultSelect = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const parts = result.display_name.split(',');
    const shortArea = parts.length > 2 ? `${parts[0].trim()}, ${parts[parts.length - 1].trim()}` : result.display_name;

    setSearchResults([]);
    setSearchQuery(result.display_name);
    updatePinPosition(lat, lng, true, shortArea);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-indigo-600 animate-spin-slow" />
            <div>
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                Select Any Location in the World
              </h2>
              <p className="text-xs text-slate-400">
                Click anywhere on the world map or search any city, landmark, or country.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Live Search Bar */}
        <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 relative z-30">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ANY place in the world (e.g. Tokyo, Paris, New York, London, Dubai, Sydney, Vellore, Krishnagiri)..."
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
            />
            {isSearching && (
              <Loader2 className="w-4 h-4 text-indigo-600 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-4 right-4 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-h-60 overflow-y-auto z-40 divide-y divide-slate-100 dark:divide-slate-800">
              {searchResults.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSearchResultSelect(item)}
                  className="p-3 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.display_name}</span>
                  </div>
                  <span className="text-[10px] text-indigo-600 font-bold shrink-0">Select →</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leaflet World Map Container */}
        <div className="flex-1 relative z-10">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>

        {/* Footer Inspector & Confirmation Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 z-30">
          <div className="flex items-center gap-3 text-xs">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 font-bold">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Selected Area:</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  {isReverseGeocoding ? 'Detecting area...' : selectedArea}
                </span>
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                Lat: {selectedLat.toFixed(5)}, Lng: {selectedLng.toFixed(5)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all flex-1 sm:flex-none text-center"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm({
                  lat: selectedLat,
                  lng: selectedLng,
                  area: selectedArea,
                });
                onClose();
              }}
              className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex-1 sm:flex-none"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Selected World Location</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
