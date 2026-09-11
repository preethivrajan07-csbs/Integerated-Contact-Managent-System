package com.icms.entity;

public enum PrivacyLevel {
    PRIVATE,      // Home location completely hidden
    APPROXIMATE,  // Show only fuzzy approximate city/area centroid
    PUBLIC        // Location discoverable with approximate radius
}
