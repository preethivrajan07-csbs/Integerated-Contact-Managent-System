package com.icms.service;

import com.icms.entity.Contact;
import com.icms.entity.Event;
import com.icms.exception.ResourceNotFoundException;
import com.icms.repository.ContactRepository;
import com.icms.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final ContactRepository contactRepository;

    public EventService(EventRepository eventRepository, ContactRepository contactRepository) {
        this.eventRepository = eventRepository;
        this.contactRepository = contactRepository;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
    }

    @Transactional
    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    @Transactional
    public Event updateEvent(Long id, Event updatedData) {
        Event existing = getEventById(id);
        existing.setEventName(updatedData.getEventName());
        existing.setDescription(updatedData.getDescription());
        existing.setEventDate(updatedData.getEventDate());
        existing.setEventTime(updatedData.getEventTime());
        existing.setLocationName(updatedData.getLocationName());
        existing.setLatitude(updatedData.getLatitude());
        existing.setLongitude(updatedData.getLongitude());
        existing.setCategory(updatedData.getCategory());
        return eventRepository.save(existing);
    }

    @Transactional
    public Event addParticipant(Long eventId, Long contactId) {
        Event event = getEventById(eventId);
        Contact contact = contactRepository.findById(contactId)
            .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + contactId));

        if (!event.getParticipants().contains(contact)) {
            event.getParticipants().add(contact);
            // Boost relationship score for shared event
            contact.setRelationshipScore(Math.min(100, (contact.getRelationshipScore() != null ? contact.getRelationshipScore() : 50) + 10));
            contactRepository.save(contact);
        }
        return eventRepository.save(event);
    }

    @Transactional
    public Event removeParticipant(Long eventId, Long contactId) {
        Event event = getEventById(eventId);
        event.getParticipants().removeIf(c -> c.getId().equals(contactId));
        return eventRepository.save(event);
    }

    @Transactional
    public void deleteEvent(Long id) {
        Event event = getEventById(id);
        eventRepository.delete(event);
    }
}
