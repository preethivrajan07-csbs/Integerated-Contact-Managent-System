package com.icms.dto;

import com.icms.entity.Category;

public class NearbyContactDTO {

    private Long contactId;
    private String fullName;
    private String avatarUrl;
    private Category category;
    private Double approximateDistanceKm;
    private String approximateArea; // e.g. "Chennai Area"
    private Double displayLatitude;  // Fuzzed/Centroid lat
    private Double displayLongitude; // Fuzzed/Centroid lng
    private Boolean isExactLocationHidden;

    public NearbyContactDTO() {}

    public NearbyContactDTO(Long contactId, String fullName, String avatarUrl, Category category, Double approximateDistanceKm, String approximateArea, Double displayLatitude, Double displayLongitude, Boolean isExactLocationHidden) {
        this.contactId = contactId;
        this.fullName = fullName;
        this.avatarUrl = avatarUrl;
        this.category = category;
        this.approximateDistanceKm = approximateDistanceKm;
        this.approximateArea = approximateArea;
        this.displayLatitude = displayLatitude;
        this.displayLongitude = displayLongitude;
        this.isExactLocationHidden = isExactLocationHidden;
    }

    public Long getContactId() { return contactId; }
    public void setContactId(Long contactId) { this.contactId = contactId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public Double getApproximateDistanceKm() { return approximateDistanceKm; }
    public void setApproximateDistanceKm(Double approximateDistanceKm) { this.approximateDistanceKm = approximateDistanceKm; }

    public String getApproximateArea() { return approximateArea; }
    public void setApproximateArea(String approximateArea) { this.approximateArea = approximateArea; }

    public Double getDisplayLatitude() { return displayLatitude; }
    public void setDisplayLatitude(Double displayLatitude) { this.displayLatitude = displayLatitude; }

    public Double getDisplayLongitude() { return displayLongitude; }
    public void setDisplayLongitude(Double displayLongitude) { this.displayLongitude = displayLongitude; }

    public Boolean getIsExactLocationHidden() { return isExactLocationHidden; }
    public void setIsExactLocationHidden(Boolean isExactLocationHidden) { this.isExactLocationHidden = isExactLocationHidden; }
}
