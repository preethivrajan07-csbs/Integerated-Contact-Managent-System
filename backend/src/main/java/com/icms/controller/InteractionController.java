package com.icms.controller;

import com.icms.entity.Interaction;
import com.icms.service.InteractionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interactions")
@CrossOrigin(origins = "*")
public class InteractionController {

    private final InteractionService interactionService;

    public InteractionController(InteractionService interactionService) {
        this.interactionService = interactionService;
    }

    @GetMapping
    public ResponseEntity<List<Interaction>> getRecentInteractions() {
        return ResponseEntity.ok(interactionService.getRecentInteractions());
    }

    @GetMapping("/contact/{contactId}")
    public ResponseEntity<List<Interaction>> getInteractionsByContact(@PathVariable Long contactId) {
        return ResponseEntity.ok(interactionService.getInteractionsByContactId(contactId));
    }

    @PostMapping("/contact/{contactId}")
    public ResponseEntity<Interaction> addInteraction(@PathVariable Long contactId, @RequestBody Interaction interaction) {
        Interaction saved = interactionService.addInteraction(contactId, interaction);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
}
