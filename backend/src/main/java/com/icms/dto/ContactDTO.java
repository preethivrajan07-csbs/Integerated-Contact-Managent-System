package com.icms.dto;

import com.icms.entity.Category;
import com.icms.entity.PrivacyLevel;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class ContactDTO {

    private Long id;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @Email(message = "Valid email is required")
    private String email;

    private String avatarUrl;
    private String address;
    private Category category = Category.OTHER;
    private String notes;
    private Integer relationshipScore = 50;

    private Double homeLatitude;
    private Double homeLongitude;
    private String homeCityArea;
    private PrivacyLevel privacyLevel = PrivacyLevel.APPROXIMATE;
    private Boolean allowNearbyDiscovery = true;

    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    public ContactDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Integer getRelationshipScore() { return relationshipScore; }
    public void setRelationshipScore(Integer relationshipScore) { this.relationshipScore = relationshipScore; }

    public Double getHomeLatitude() { return homeLatitude; }
    public void setHomeLatitude(Double homeLatitude) { this.homeLatitude = homeLatitude; }

    public Double getHomeLongitude() { return homeLongitude; }
    public void setHomeLongitude(Double homeLongitude) { this.homeLongitude = homeLongitude; }

    public String getHomeCityArea() { return homeCityArea; }
    public void setHomeCityArea(String homeCityArea) { this.homeCityArea = homeCityArea; }

    public PrivacyLevel getPrivacyLevel() { return privacyLevel; }
    public void setPrivacyLevel(PrivacyLevel privacyLevel) { this.privacyLevel = privacyLevel; }

    public Boolean getAllowNearbyDiscovery() { return allowNearbyDiscovery; }
    public void setAllowNearbyDiscovery(Boolean allowNearbyDiscovery) { this.allowNearbyDiscovery = allowNearbyDiscovery; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

    public LocalDateTime getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(LocalDateTime updatedDate) { this.updatedDate = updatedDate; }
}
