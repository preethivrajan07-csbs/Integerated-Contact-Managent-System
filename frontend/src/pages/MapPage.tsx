import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Shield, Search, Crosshair, Navigation, Layers } from 'lucide-react';
import { Contact, Event, NearbyContact } from '../types';
import { fetchContacts, fetchEvents, fetchNearbyContacts } from '../services/api';

interface MapPageProps {
  searchQuery?: string;
  onSelectContact: (contact: Contact) => void;
}

interface MapTargetItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'MEETING' | 'EVENT' | 'NEARBY';
  lat: number;
  lng: number;
  contact?: Contact;
  event?: Event;
  nearby?: NearbyContact;
}

export const MapPage: React.FC<MapPageProps> = ({ searchQuery = '', onSelectContact }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [nearby, setNearby] = useState<NearbyContact[]>([]);
  const [filterType, setFilterType] = useState<'ALL' | 'MEETINGS' | 'EVENTS' | 'NEARBY'>('ALL');

  const [mapSearch, setMapSearch] = useState(searchQuery);
  const [selectedTarget, setSelectedTarget] = useState<MapTargetItem | null>(null);
  const [searchResults, setSearchResults] = useState<MapTargetItem[]>([]);

  useEffect(() => {
    Promise.all([
      fetchContacts(),
      fetchEvents(),
      fetchNearbyContacts(12.9165, 79.1325, 500) // Radius 500km to cover all regional cities (Vellore, Krishnagiri, Ambur, Vaniyambadi, Chennai)
    ]).then(([c, e, n]) => {
      setContacts(c);
      setEvents(e);
      setNearby(n);
    });
  }, []);

  // Expose global window handler for popup "View Profile" clicks
  useEffect(() => {
    (window as any).handleMapProfileClick = (contactId: number) => {
      const found = contacts.find(c => c.id === contactId);
      if (found) onSelectContact(found);
    };
  }, [contacts, onSelectContact]);

  // Sync search query from header
  useEffect(() => {
    if (searchQuery) setMapSearch(searchQuery);
  }, [searchQuery]);

  // Build list of all searchable map locations
  const targetItems: MapTargetItem[] = [];

  contacts.forEach(c => {
    c.meetingLocations?.forEach(loc => {
      if (typeof loc.latitude === 'number' && typeof loc.longitude === 'number') {
        targetItems.push({
          id: `loc_${loc.id || Math.random()}`,
          title: loc.locationName,
          subtitle: `Meeting Place: ${c.fullName} (${c.homeCityArea || 'Region'})`,
          type: 'MEETING',
          lat: loc.latitude,
          lng: loc.longitude,
          contact: c,
        });
      }
    });
  });

  events.forEach(ev => {
    if (typeof ev.latitude === 'number' && typeof ev.longitude === 'number') {
      targetItems.push({
        id: `ev_${ev.id}`,
        title: ev.eventName,
        subtitle: `Event Venue: ${ev.locationName}`,
        type: 'EVENT',
        lat: ev.latitude,
        lng: ev.longitude,
        event: ev,
      });
    }
  });

  nearby.forEach(nb => {
    if (typeof nb.displayLatitude === 'number' && typeof nb.displayLongitude === 'number') {
      targetItems.push({
        id: `nb_${nb.contactId}`,
        title: nb.fullName,
        subtitle: `Approx. Area: ${nb.approximateArea}`,
        type: 'NEARBY',
        lat: nb.displayLatitude,
        lng: nb.displayLongitude,
        nearby: nb,
      });
    }
  });

  // Filter map search results dropdown
  useEffect(() => {
    if (!mapSearch.trim()) {
      setSearchResults([]);
      return;
    }
    const q = mapSearch.toLowerCase();
    const matches = targetItems.filter(
      item => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)
    );
    setSearchResults(matches);
  }, [mapSearch, contacts, events, nearby]);

  // Smoothly fly map to selected target & open popup
  const focusOnTarget = (target: MapTargetItem) => {
    setSelectedTarget(target);
    setSearchResults([]);
    setMapSearch(target.title);

    if (leafletMapRef.current) {
      const map = leafletMapRef.current;
      map.flyTo([target.lat, target.lng], 14, {
        animate: true,
        duration: 1.2,
      });

      const markerKey = `${target.type}_${target.lat}_${target.lng}`;
      const marker = markersRef.current[markerKey];
      if (marker) {
        setTimeout(() => marker.openPopup(), 600);
      }
    }
  };

  // Initialize and update Leaflet Map instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Map once
    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [12.9165, 79.1325], // Default center focused on North Tamil Nadu (Vellore region)
        zoom: 9,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      leafletMapRef.current = map;
    }

    const map = leafletMapRef.current;
    markersRef.current = {};
    const allCoords: L.LatLngExpression[] = [];

    // Clear existing markers
    map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    const createIcon = (bgColor: string, symbol: string) => {
      return L.divIcon({
        className: 'custom-leaflet-pin',
        html: `<div style="background-color: ${bgColor}; width: 34px; height: 34px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">${symbol}</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -18],
      });
    };

    // 1. Meeting Locations Markers (Red)
    if (filterType === 'ALL' || filterType === 'MEETINGS') {
      contacts.forEach(c => {
        c.meetingLocations?.forEach(loc => {
          if (loc.latitude && loc.longitude) {
            allCoords.push([loc.latitude, loc.longitude]);
            const key = `MEETING_${loc.latitude}_${loc.longitude}`;
            const marker = L.marker([loc.latitude, loc.longitude], {
              icon: createIcon('#ef4444', '📍'),
            }).addTo(map);

            marker.bindPopup(`
              <div style="font-family: system-ui, sans-serif; padding: 6px; min-width: 200px;">
                <span style="background: #fee2e2; color: #dc2626; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">📍 MEETING LOCATION</span>
                <h4 style="margin: 6px 0 2px 0; font-weight: bold; font-size: 14px; color: #111827;">${loc.locationName}</h4>
                <p style="font-size: 12px; margin: 0 0 4px 0; color: #4b5563;">Met Person: <b style="color:#4f46e5;">${c.fullName}</b></p>
                <p style="font-size: 11px; margin: 0 0 8px 0; color: #6b7280;">Region: ${c.homeCityArea || 'Custom Area'}</p>
                <button onclick="window.handleMapProfileClick(${c.id})" style="width: 100%; background: #4f46e5; color: white; border: none; padding: 6px 10px; border-radius: 8px; font-weight: bold; font-size: 11px; cursor: pointer;">
                  View Full Profile →
                </button>
              </div>
            `);

            markersRef.current[key] = marker;
          }
        });
      });
    }

    // 2. Event Location Markers (Indigo)
    if (filterType === 'ALL' || filterType === 'EVENTS') {
      events.forEach(ev => {
        if (ev.latitude && ev.longitude) {
          allCoords.push([ev.latitude, ev.longitude]);
          const key = `EVENT_${ev.latitude}_${ev.longitude}`;
          const marker = L.marker([ev.latitude, ev.longitude], {
            icon: createIcon('#4f46e5', '🎫'),
          }).addTo(map);

          marker.bindPopup(`
            <div style="font-family: system-ui, sans-serif; padding: 6px; min-width: 200px;">
              <span style="background: #e0e7ff; color: #4338ca; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">🎫 EVENT VENUE</span>
              <h4 style="margin: 6px 0 2px 0; font-weight: bold; font-size: 14px; color: #111827;">${ev.eventName}</h4>
              <p style="font-size: 12px; margin: 0 0 4px 0; color: #4b5563;">Venue: <b>${ev.locationName}</b></p>
              <p style="font-size: 11px; margin: 0 0 4px 0; color: #6b7280;">Date: ${ev.eventDate}</p>
            </div>
          `);

          markersRef.current[key] = marker;
        }
      });
    }

    // 3. Privacy-Protected Nearby Discovery Markers (Emerald)
    if (filterType === 'ALL' || filterType === 'NEARBY') {
      nearby.forEach(nb => {
        if (nb.displayLatitude && nb.displayLongitude) {
          allCoords.push([nb.displayLatitude, nb.displayLongitude]);
          const key = `NEARBY_${nb.displayLatitude}_${nb.displayLongitude}`;
          const marker = L.marker([nb.displayLatitude, nb.displayLongitude], {
            icon: createIcon('#10b981', '🟢'),
          }).addTo(map);

          marker.bindPopup(`
            <div style="font-family: system-ui, sans-serif; padding: 6px; min-width: 220px;">
              <span style="background: #d1fae5; color: #047857; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">🟢 PRIVACY PROTECTED NEARBY</span>
              <h4 style="margin: 6px 0 2px 0; font-weight: bold; font-size: 14px; color: #111827;">${nb.fullName}</h4>
              <p style="font-size: 12px; margin: 0 0 2px 0; color: #4b5563;">Category: <b>${nb.category}</b></p>
              <p style="font-size: 11px; margin: 0 0 8px 0; color: #059669; font-weight: 600;">📍 Approximate Area: ${nb.approximateArea}</p>
              <p style="font-size: 10px; margin: 0 0 8px 0; color: #9ca3af; italic;">Exact home address hidden by Privacy Shield.</p>
              <button onclick="window.handleMapProfileClick(${nb.contactId})" style="width: 100%; background: #059669; color: white; border: none; padding: 6px 10px; border-radius: 8px; font-weight: bold; font-size: 11px; cursor: pointer;">
                View Contact Details →
              </button>
            </div>
          `);

          markersRef.current[key] = marker;
        }
      });
    }

    // Auto-fit map viewport to include ALL markers across Vellore, Krishnagiri, Ambur, Vaniyambadi, Chennai, etc.
    if (allCoords.length > 0) {
      const bounds = L.latLngBounds(allCoords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

  }, [contacts, events, nearby, filterType]);

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-7 h-7 text-rose-500" />
            <span>Interactive Multi-Region Map Intelligence</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Displaying contacts across Vellore, Krishnagiri, Ambur, Vaniyambadi, Salem, Chennai, and custom regions.
          </p>
        </div>

        {/* Legend Filter Pills */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {[
            { id: 'ALL', label: 'All Markers' },
            { id: 'MEETINGS', label: '📍 Meetings' },
            { id: 'EVENTS', label: '🎫 Events' },
            { id: 'NEARBY', label: '🟢 Nearby' },
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setFilterType(type.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === type.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Search & Focus Controls */}
      <div className="relative z-20">
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={mapSearch}
              onChange={e => setMapSearch(e.target.value)}
              placeholder="Search contact or region (e.g. Vellore, Krishnagiri, Ambur, Vaniyambadi, Chennai)..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {selectedTarget && (
            <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-xl text-xs font-bold border border-indigo-200 dark:border-indigo-900">
              <Crosshair className="w-3.5 h-3.5" />
              <span>Focused: {selectedTarget.title}</span>
            </div>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 z-30">
            {searchResults.map(item => (
              <div
                key={item.id}
                onClick={() => focusOnTarget(item)}
                className="p-3.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 cursor-pointer flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ${
                      item.type === 'MEETING' ? 'bg-rose-500' : item.type === 'EVENT' ? 'bg-indigo-600' : 'bg-emerald-600'
                    }`}
                  >
                    {item.type === 'MEETING' ? '📍' : item.type === 'EVENT' ? '🎫' : '🟢'}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{item.title}</h4>
                    <p className="text-xs text-slate-400">{item.subtitle}</p>
                  </div>
                </div>

                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5" /> Locate on Map
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Map Frame */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs px-2 text-slate-500">
          <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
            <Shield className="w-4 h-4" />
            <span>Privacy Guard Active: Home locations are protected using fuzzy region centroids.</span>
          </span>
          <span>Showing markers across all regions</span>
        </div>

        <div className="w-full h-[550px] rounded-2xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800 relative z-0">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};
