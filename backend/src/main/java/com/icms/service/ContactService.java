package com.icms.service;

import com.icms.dto.ContactDTO;
import com.icms.dto.DuplicateCheckResponse;
import com.icms.entity.Contact;
import com.icms.entity.Interaction;
import com.icms.entity.MeetingLocation;
import com.icms.exception.DuplicateContactException;
import com.icms.exception.ResourceNotFoundException;
import com.icms.repository.ContactRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    public Contact getContactById(Long id) {
        return contactRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
    }

    public List<Contact> searchContacts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return contactRepository.findAll();
        }
        return contactRepository.searchContacts(query.trim());
    }

    /**
     * Smart Duplicate Detection before saving
     */
    public DuplicateCheckResponse checkForDuplicates(String phone, String email, Long currentContactId) {
        List<Contact> duplicates = contactRepository.findDuplicates(phone, email);

        for (Contact dup : duplicates) {
            // Ignore self if updating existing contact
            if (currentContactId != null && dup.getId().equals(currentContactId)) {
                continue;
            }

            String matchedBy = phone.equalsIgnoreCase(dup.getPhoneNumber()) ? "PHONE" : "EMAIL";
            return new DuplicateCheckResponse(
                true,
                matchedBy,
                dup,
                "Possible duplicate contact found matching " + matchedBy.toLowerCase() + ": " + dup.getFullName()
            );
        }

        return new DuplicateCheckResponse(false, null, null, "No duplicates found");
    }

    @Transactional
    public Contact createContact(Contact contact, boolean forceSave) {
        if (!forceSave) {
            DuplicateCheckResponse dupResponse = checkForDuplicates(contact.getPhoneNumber(), contact.getEmail(), null);
            if (dupResponse.isDuplicate()) {
                throw new DuplicateContactException(dupResponse.getMessage(), dupResponse.getExistingContact());
            }
        }
        return contactRepository.save(contact);
    }

    @Transactional
    public Contact updateContact(Long id, Contact updatedData) {
        Contact existing = getContactById(id);

        existing.setFullName(updatedData.getFullName());
        existing.setPhoneNumber(updatedData.getPhoneNumber());
        existing.setEmail(updatedData.getEmail());
        existing.setAvatarUrl(updatedData.getAvatarUrl());
        existing.setAddress(updatedData.getAddress());
        existing.setCategory(updatedData.getCategory());
        existing.setNotes(updatedData.getNotes());
        existing.setHomeLatitude(updatedData.getHomeLatitude());
        existing.setHomeLongitude(updatedData.getHomeLongitude());
        existing.setHomeCityArea(updatedData.getHomeCityArea());
        existing.setPrivacyLevel(updatedData.getPrivacyLevel());
        existing.setAllowNearbyDiscovery(updatedData.getAllowNearbyDiscovery());

        return contactRepository.save(existing);
    }

    /**
     * Smart Merge: Combines new incoming contact data into an existing target contact.
     */
    @Transactional
    public Contact mergeContacts(Long targetContactId, Contact incomingData) {
        Contact target = getContactById(targetContactId);

        if ((target.getEmail() == null || target.getEmail().isEmpty()) && incomingData.getEmail() != null) {
            target.setEmail(incomingData.getEmail());
        }

        if ((target.getAddress() == null || target.getAddress().isEmpty()) && incomingData.getAddress() != null) {
            target.setAddress(incomingData.getAddress());
        }

        if (incomingData.getNotes() != null && !incomingData.getNotes().isEmpty()) {
            String combinedNotes = (target.getNotes() != null ? target.getNotes() + "\n--- Merged Notes ---\n" : "") + incomingData.getNotes();
            target.setNotes(combinedNotes);
        }

        // Increase relationship strength on merge
        target.setRelationshipScore(Math.min(100, (target.getRelationshipScore() != null ? target.getRelationshipScore() : 50) + 15));

        return contactRepository.save(target);
    }

    @Transactional
    public void deleteContact(Long id) {
        Contact contact = getContactById(id);
        contactRepository.delete(contact);
    }
}
