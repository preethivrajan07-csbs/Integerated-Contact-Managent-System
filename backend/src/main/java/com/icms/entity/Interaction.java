package com.icms.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interactions")
public class Interaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InteractionType interactionType = InteractionType.MEETING;

    @Column(nullable = false)
    private LocalDateTime interactionDate = LocalDateTime.now();

    @Column(length = 2000)
    private String notes;

    private String locationName;

    private String relatedEventName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id")
    @JsonIgnoreProperties({"interactions", "meetingLocations", "events"})
    private Contact contact;

    public Interaction() {}

    public Interaction(InteractionType interactionType, LocalDateTime interactionDate, String notes, String locationName, String relatedEventName, Contact contact) {
        this.interactionType = interactionType;
        this.interactionDate = interactionDate;
        this.notes = notes;
        this.locationName = locationName;
        this.relatedEventName = relatedEventName;
        this.contact = contact;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public InteractionType getInteractionType() {
        return interactionType;
    }

    public void setInteractionType(InteractionType interactionType) {
        this.interactionType = interactionType;
    }

    public LocalDateTime getInteractionDate() {
        return interactionDate;
    }

    public void setInteractionDate(LocalDateTime interactionDate) {
        this.interactionDate = interactionDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getRelatedEventName() {
        return relatedEventName;
    }

    public void setRelatedEventName(String relatedEventName) {
        this.relatedEventName = relatedEventName;
    }

    public Contact getContact() {
        return contact;
    }

    public void setContact(Contact contact) {
        this.contact = contact;
    }
}
