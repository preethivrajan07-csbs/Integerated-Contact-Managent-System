package com.icms.controller;

import com.icms.dto.NearbyContactDTO;
import com.icms.entity.Contact;
import com.icms.entity.MeetingLocation;
import com.icms.repository.ContactRepository;
import com.icms.repository.MeetingLocationRepository;
import com.icms.service.LocationPrivacyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class LocationController {

    private final MeetingLocationRepository meetingLocationRepository;
    private final ContactRepository contactRepository;
    private final LocationPrivacyService locationPrivacyService;

    public LocationController(MeetingLocationRepository meetingLocationRepository,
                              ContactRepository contactRepository,
                              LocationPrivacyService locationPrivacyService) {
        this.meetingLocationRepository = meetingLocationRepository;
        this.contactRepository = contactRepository;
        this.locationPrivacyService = locationPrivacyService;
    }

    @GetMapping("/locations")
    public ResponseEntity<List<MeetingLocation>> getAllMeetingLocations() {
        return ResponseEntity.ok(meetingLocationRepository.findAll());
    }

    @GetMapping("/nearby-contacts")
    public ResponseEntity<List<NearbyContactDTO>> getNearbyContacts(
            @RequestParam(defaultValue = "13.0827") double lat,
            @RequestParam(defaultValue = "80.2707") double lng,
            @RequestParam(defaultValue = "10.0") double radius) {

        List<Contact> allContacts = contactRepository.findAll();
        List<NearbyContactDTO> nearby = locationPrivacyService.findNearbyContacts(allContacts, lat, lng, radius);
        return ResponseEntity.ok(nearby);
    }
}
