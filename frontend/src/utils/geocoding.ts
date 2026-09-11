// City & Town Geocoding Lookup Table for Tamil Nadu, South India & major regions
export const KNOWN_CITIES_MAP: { [key: string]: { lat: number; lng: number; area: string } } = {
  vellore: { lat: 12.9165, lng: 79.1325, area: 'Vellore Fort Region' },
  krishnagiri: { lat: 12.5266, lng: 78.2146, area: 'Krishnagiri Region' },
  ambur: { lat: 12.7909, lng: 78.7166, area: 'Ambur Region' },
  vaniyambadi: { lat: 12.6825, lng: 78.6186, area: 'Vaniyambadi Region' },
  tirupathur: { lat: 12.4950, lng: 78.5670, area: 'Tirupathur Region' },
  dharmapuri: { lat: 12.1211, lng: 78.1582, area: 'Dharmapuri Region' },
  hosur: { lat: 12.7409, lng: 77.8253, area: 'Hosur Industrial Region' },
  salem: { lat: 11.6643, lng: 78.1460, area: 'Salem City Region' },
  coimbatore: { lat: 11.0168, lng: 76.9558, area: 'Coimbatore Region' },
  madurai: { lat: 9.9252, lng: 78.1198, area: 'Madurai Region' },
  tiruchirappalli: { lat: 10.7905, lng: 78.7047, area: 'Trichy Region' },
  trichy: { lat: 10.7905, lng: 78.7047, area: 'Trichy Region' },
  erode: { lat: 11.3410, lng: 77.7172, area: 'Erode Region' },
  kanchipuram: { lat: 12.8342, lng: 79.7036, area: 'Kanchipuram Region' },
  tirunelveli: { lat: 8.7139, lng: 77.7567, area: 'Tirunelveli Region' },
  thanjavur: { lat: 10.7870, lng: 79.1378, area: 'Thanjavur Region' },
  bangalore: { lat: 12.9716, lng: 77.5946, area: 'Bengaluru Region' },
  bengaluru: { lat: 12.9716, lng: 77.5946, area: 'Bengaluru Region' },
  chennai: { lat: 13.0827, lng: 80.2707, area: 'Chennai Central' },
};

/**
 * Automatically lookup coordinates based on area or address string.
 * First checks fast offline city lookup, then falls back to OpenStreetMap Nominatim API.
 */
export async function geocodeLocation(query: string): Promise<{ lat: number; lng: number; area: string } | null> {
  if (!query || !query.trim()) return null;

  const normalized = query.toLowerCase().trim();

  // 1. Check instant offline city lookup map
  for (const [key, coords] of Object.entries(KNOWN_CITIES_MAP)) {
    if (normalized.includes(key)) {
      return coords;
    }
  }

  // 2. OpenStreetMap Nominatim Live Geocoding Fallback
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      { headers: { 'User-Agent': 'ICMS-ContactManagementSystem/1.0' } }
    );
    const data = await res.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        area: data[0].display_name.split(',')[0] || query,
      };
    }
  } catch (err) {
    console.warn('Live geocoding fallback failed', err);
  }

  return null;
}
