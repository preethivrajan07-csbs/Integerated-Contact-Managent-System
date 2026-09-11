package com.icms.service;

import com.icms.entity.Contact;
import com.icms.entity.Interaction;
import com.icms.exception.ResourceNotFoundException;
import com.icms.repository.ContactRepository;
import com.icms.repository.InteractionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InteractionService {

    private final InteractionRepository interactionRepository;
    private final ContactRepository contactRepository;

    public InteractionService(InteractionRepository interactionRepository, ContactRepository contactRepository) {
        this.interactionRepository = interactionRepository;
        this.contactRepository = contactRepository;
    }

    public List<Interaction> getInteractionsByContactId(Long contactId) {
        return interactionRepository.findByContactIdOrderByInteractionDateDesc(contactId);
    }

    public List<Interaction> getRecentInteractions() {
        return interactionRepository.findRecentInteractions();
    }

    @Transactional
    public Interaction addInteraction(Long contactId, Interaction interaction) {
        Contact contact = contactRepository.findById(contactId)
            .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + contactId));

        interaction.setContact(contact);
        Interaction saved = interactionRepository.save(interaction);

        // Boost relationship score on new interaction
        contact.setRelationshipScore(Math.min(100, (contact.getRelationshipScore() != null ? contact.getRelationshipScore() : 50) + 5));
        contactRepository.save(contact);

        return saved;
    }
}
