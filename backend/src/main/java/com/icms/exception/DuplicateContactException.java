package com.icms.exception;

import com.icms.entity.Contact;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateContactException extends RuntimeException {
    private final Contact existingContact;

    public DuplicateContactException(String message, Contact existingContact) {
        super(message);
        this.existingContact = existingContact;
    }

    public Contact getExistingContact() {
        return existingContact;
    }
}
