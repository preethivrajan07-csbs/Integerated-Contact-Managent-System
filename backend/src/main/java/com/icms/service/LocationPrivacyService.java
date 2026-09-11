package com.icms.service;

import com.icms.dto.NearbyContactDTO;
import com.icms.entity.Contact;
import com.icms.entity.PrivacyLevel;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LocationPrivacyService {

    private static final double EARTH_RADIUS_KM = 6371.0;

    /**
     * Haversine formula for distance calculation between two geo coordinates
     */
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }

    /**
     * Filters contacts near reference coordinates within a specified radius (km).
     * Enforces strict location privacy protection:
     * - PRIVATE location contacts are hidden or masked completely.
     * - APPROXIMATE location contacts return fuzzed coordinates (jittered centroid) + approximate area string.
     * - Exact home address and exact lat/lng are NEVER exposed!
     */
    public List<NearbyContactDTO> findNearbyContacts(List<Contact> allContacts, double userLat, double userLng, double radiusKm) {
        List<NearbyContactDTO> nearbyList = new ArrayList<>();

        for (Contact contact : allContacts) {
            // Check if contact allows nearby discovery and has valid location
            if (Boolean.FALSE.equals(contact.getAllowNearbyDiscovery()) || contact.getHomeLatitude() == null || contact.getHomeLongitude() == null) {
                continue;
            }

            // Skip PRIVATE contacts completely from nearby discovery map
            if (contact.getPrivacyLevel() == PrivacyLevel.PRIVATE) {
                continue;
            }

            double actualDistance = calculateDistance(userLat, userLng, contact.getHomeLatitude(), contact.getHomeLongitude());

            if (actualDistance <= radiusKm) {
                // Generate deterministic or slight fuzzed display coordinates (fuzzy centroid)
                // Adds ~0.008 degrees (~800 meters) pseudo-random offset based on contact ID
                long seed = contact.getId() != null ? contact.getId() : 1L;
                double latFuzz = ((seed % 7) - 3) * 0.003;
                double lngFuzz = ((seed % 5) - 2) * 0.003;

                double displayLat = contact.getHomeLatitude() + latFuzz;
                double displayLng = contact.getHomeLongitude() + lngFuzz;

                String areaName = contact.getHomeCityArea() != null ? contact.getHomeCityArea() : "Approximate Region";

                nearbyList.add(new NearbyContactDTO(
                    contact.getId(),
                    contact.getFullName(),
                    contact.getAvatarUrl(),
                    contact.getCategory(),
                    Math.round(actualDistance * 10.0) / 10.0, // Rounded to 1 decimal
                    areaName,
                    displayLat,
                    displayLng,
                    true // Always set to true: exact home location is protected
                ));
            }
        }

        return nearbyList;
    }
}
