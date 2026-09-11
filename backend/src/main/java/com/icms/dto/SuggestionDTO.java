package com.icms.dto;

import com.icms.entity.Category;

public class SuggestionDTO {

    private Long contactId;
    private String fullName;
    private String avatarUrl;
    private Category category;
    private String rationale;
    private Integer relevanceScore;
    private String previousEventName;
    private String meetingLocationName;

    public SuggestionDTO() {}

    public SuggestionDTO(Long contactId, String fullName, String avatarUrl, Category category, String rationale, Integer relevanceScore, String previousEventName, String meetingLocationName) {
        this.contactId = contactId;
        this.fullName = fullName;
        this.avatarUrl = avatarUrl;
        this.category = category;
        this.rationale = rationale;
        this.relevanceScore = relevanceScore;
        this.previousEventName = previousEventName;
        this.meetingLocationName = meetingLocationName;
    }

    public Long getContactId() { return contactId; }
    public void setContactId(Long contactId) { this.contactId = contactId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public String getRationale() { return rationale; }
    public void setRationale(String rationale) { this.rationale = rationale; }

    public Integer getRelevanceScore() { return relevanceScore; }
    public void setRelevanceScore(Integer relevanceScore) { this.relevanceScore = relevanceScore; }

    public String getPreviousEventName() { return previousEventName; }
    public void setPreviousEventName(String previousEventName) { this.previousEventName = previousEventName; }

    public String getMeetingLocationName() { return meetingLocationName; }
    public void setMeetingLocationName(String meetingLocationName) { this.meetingLocationName = meetingLocationName; }
}
