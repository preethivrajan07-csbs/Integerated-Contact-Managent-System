package com.icms.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Contact Entity extending Person (Inheritance Demonstration)
 * Contains contact-specific metadata, location privacy settings, and relationship collections.
 */
@Entity
@Table(name = "contacts")
public class Contact extends Person {

    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category = Category.OTHER;

    @Column(length = 2000)
    private String notes;

    private Integer relationshipScore = 50; // Transparent strength score 0-100

    // Home Location & Privacy Settings (Sensitive data protected by PrivacyLevel)
    private Double homeLatitude;
    private Double homeLongitude;
    private String homeCityArea; // e.g. "Chennai Area" shown instead of exact address

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PrivacyLevel privacyLevel = PrivacyLevel.APPROXIMATE;

    private Boolean allowNearbyDiscovery = true;

    @OneToMany(mappedBy = "contact", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("contact")
    private List<MeetingLocation> meetingLocations = new ArrayList<>();

    @OneToMany(mappedBy = "contact", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("contact")
    private List<Interaction> interactions = new ArrayList<>();

    @ManyToMany(mappedBy = "participants")
    @JsonIgnoreProperties("participants")
    private List<Event> events = new ArrayList<>();

    public Contact() {
        super();
    }

    public Contact(String fullName, String phoneNumber, String email, Category category, String address) {
        super(fullName, phoneNumber, email);
        this.category = category;
        this.address = address;
    }

    // Getters and Setters
    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Integer getRelationshipScore() {
        return relationshipScore;
    }

    public void setRelationshipScore(Integer relationshipScore) {
        this.relationshipScore = relationshipScore;
    }

    public Double getHomeLatitude() {
        return homeLatitude;
    }

    public void setHomeLatitude(Double homeLatitude) {
        this.homeLatitude = homeLatitude;
    }

    public Double getHomeLongitude() {
        return homeLongitude;
    }

    public void setHomeLongitude(Double homeLongitude) {
        this.homeLongitude = homeLongitude;
    }

    public String getHomeCityArea() {
        return homeCityArea;
    }

    public void setHomeCityArea(String homeCityArea) {
        this.homeCityArea = homeCityArea;
    }

    public PrivacyLevel getPrivacyLevel() {
        return privacyLevel;
    }

    public void setPrivacyLevel(PrivacyLevel privacyLevel) {
        this.privacyLevel = privacyLevel;
    }

    public Boolean getAllowNearbyDiscovery() {
        return allowNearbyDiscovery;
    }

    public void setAllowNearbyDiscovery(Boolean allowNearbyDiscovery) {
        this.allowNearbyDiscovery = allowNearbyDiscovery;
    }

    public List<MeetingLocation> getMeetingLocations() {
        return meetingLocations;
    }

    public void setMeetingLocations(List<MeetingLocation> meetingLocations) {
        this.meetingLocations = meetingLocations;
    }

    public List<Interaction> getInteractions() {
        return interactions;
    }

    public void setInteractions(List<Interaction> interactions) {
        this.interactions = interactions;
    }

    public List<Event> getEvents() {
        return events;
    }

    public void setEvents(List<Event> events) {
        this.events = events;
    }
}
