package com.icms.controller;

import com.icms.dto.DuplicateCheckResponse;
import com.icms.entity.Contact;
import com.icms.entity.MeetingLocation;
import com.icms.repository.MeetingLocationRepository;
import com.icms.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin(origins = "*")
public class ContactController {

    private final ContactService contactService;
    private final MeetingLocationRepository meetingLocationRepository;

    public ContactController(ContactService contactService, MeetingLocationRepository meetingLocationRepository) {
        this.contactService = contactService;
        this.meetingLocationRepository = meetingLocationRepository;
    }

    @GetMapping
    public ResponseEntity<List<Contact>> getAllContacts(@RequestParam(required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(contactService.searchContacts(search));
        }
        return ResponseEntity.ok(contactService.getAllContacts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contact> getContactById(@PathVariable Long id) {
        return ResponseEntity.ok(contactService.getContactById(id));
    }

    @PostMapping("/check-duplicate")
    public ResponseEntity<DuplicateCheckResponse> checkDuplicate(
            @RequestParam String phone,
            @RequestParam String email,
            @RequestParam(required = false) Long currentId) {
        return ResponseEntity.ok(contactService.checkForDuplicates(phone, email, currentId));
    }

    @PostMapping
    public ResponseEntity<Contact> createContact(
            @Valid @RequestBody Contact contact,
            @RequestParam(defaultValue = "false") boolean forceSave) {
        Contact saved = contactService.createContact(contact, forceSave);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contact> updateContact(@PathVariable Long id, @Valid @RequestBody Contact contact) {
        Contact updated = contactService.updateContact(id, contact);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/merge")
    public ResponseEntity<Contact> mergeContact(@PathVariable Long id, @RequestBody Contact incomingData) {
        Contact merged = contactService.mergeContacts(id, incomingData);
        return ResponseEntity.ok(merged);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteContact(@PathVariable Long id) {
        contactService.deleteContact(id);
        return ResponseEntity.ok(Map.of("message", "Contact deleted successfully", "id", id.toString()));
    }

    @PostMapping("/{id}/meeting-locations")
    public ResponseEntity<MeetingLocation> addMeetingLocation(@PathVariable Long id, @RequestBody MeetingLocation location) {
        Contact contact = contactService.getContactById(id);
        location.setContact(contact);
        MeetingLocation saved = meetingLocationRepository.save(location);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
}
