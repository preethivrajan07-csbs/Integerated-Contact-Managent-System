package com.icms.controller;

import com.icms.dto.SuggestionDTO;
import com.icms.service.SuggestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suggestions")
@CrossOrigin(origins = "*")
public class SuggestionController {

    private final SuggestionService suggestionService;

    public SuggestionController(SuggestionService suggestionService) {
        this.suggestionService = suggestionService;
    }

    @GetMapping
    public ResponseEntity<List<SuggestionDTO>> getSuggestions(
            @RequestParam(required = false) String event,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(suggestionService.getSmartSuggestions(event, location, category));
    }
}
