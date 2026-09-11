package com.icms.service;

import com.icms.dto.SuggestionDTO;
import com.icms.entity.Contact;
import com.icms.entity.Event;
import com.icms.entity.MeetingLocation;
import com.icms.repository.ContactRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class SuggestionService {

    private final ContactRepository contactRepository;

    public SuggestionService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    /**
     * Context-based Contact Suggestions Engine
     * Recommends relevant contacts based on event context, location, categories, and past meeting history.
     */
    public List<SuggestionDTO> getSmartSuggestions(String eventContext, String locationContext, String targetCategory) {
        List<Contact> allContacts = contactRepository.findAll();
        List<SuggestionDTO> suggestions = new ArrayList<>();

        for (Contact contact : allContacts) {
            int score = 0;
            String rationale = "";
            String prevEvent = null;
            String prevLoc = null;

            // Check event overlap / previous event attendance
            if (contact.getEvents() != null && !contact.getEvents().isEmpty()) {
                for (Event event : contact.getEvents()) {
                    if (eventContext != null && !eventContext.trim().isEmpty() &&
                        (event.getEventName().toLowerCase().contains(eventContext.toLowerCase()) ||
                         eventContext.toLowerCase().contains(event.getCategory().toLowerCase()))) {
                        score += 40;
                        rationale = "Attended similar event: " + event.getEventName();
                        prevEvent = event.getEventName();
                        break;
                    }
                }
            }

            // Check meeting location history
            if (contact.getMeetingLocations() != null && !contact.getMeetingLocations().isEmpty()) {
                for (MeetingLocation loc : contact.getMeetingLocations()) {
                    if (locationContext != null && !locationContext.trim().isEmpty() &&
                        loc.getLocationName().toLowerCase().contains(locationContext.toLowerCase())) {
                        score += 35;
                        if (rationale.isEmpty()) {
                            rationale = "Met previously in " + loc.getLocationName();
                        } else {
                            rationale += " & met in " + loc.getLocationName();
                        }
                        prevLoc = loc.getLocationName();
                        break;
                    }
                }
            }

            // Check category match
            if (targetCategory != null && contact.getCategory() != null &&
                contact.getCategory().name().equalsIgnoreCase(targetCategory)) {
                score += 25;
                if (rationale.isEmpty()) {
                    rationale = "Relevant " + contact.getCategory().name().toLowerCase() + " contact";
                }
            }

            // Check high relationship score / frequent interactions
            if (contact.getRelationshipScore() != null && contact.getRelationshipScore() >= 75) {
                score += 15;
                if (rationale.isEmpty()) {
                    rationale = "Frequently interacted key contact";
                }
            }

            // Fallback default rationale if context provided matches generally
            if (score == 0 && (eventContext != null || locationContext != null)) {
                if ("COLLEGE".equalsIgnoreCase(contact.getCategory().name()) || "PROFESSIONAL".equalsIgnoreCase(contact.getCategory().name())) {
                    score = 30;
                    rationale = "Technology & professional contact";
                }
            }

            if (score > 0) {
                suggestions.add(new SuggestionDTO(
                    contact.getId(),
                    contact.getFullName(),
                    contact.getAvatarUrl(),
                    contact.getCategory(),
                    rationale,
                    score,
                    prevEvent,
                    prevLoc
                ));
            }
        }

        // Sort suggestions descending by relevance score
        suggestions.sort(Comparator.comparingInt(SuggestionDTO::getRelevanceScore).reversed());
        return suggestions;
    }
}
