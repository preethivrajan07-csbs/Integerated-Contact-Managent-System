package com.icms.dto;

import com.icms.entity.Contact;

public class DuplicateCheckResponse {

    private boolean isDuplicate;
    private String matchedBy; // "PHONE" or "EMAIL"
    private Contact existingContact;
    private String message;

    public DuplicateCheckResponse() {}

    public DuplicateCheckResponse(boolean isDuplicate, String matchedBy, Contact existingContact, String message) {
        this.isDuplicate = isDuplicate;
        this.matchedBy = matchedBy;
        this.existingContact = existingContact;
        this.message = message;
    }

    public boolean isDuplicate() { return isDuplicate; }
    public void setDuplicate(boolean duplicate) { isDuplicate = duplicate; }

    public String getMatchedBy() { return matchedBy; }
    public void setMatchedBy(String matchedBy) { this.matchedBy = matchedBy; }

    public Contact getExistingContact() { return existingContact; }
    public void setExistingContact(Contact existingContact) { this.existingContact = existingContact; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
