package com.icms.controller;

import com.icms.service.AnalyticsAsyncService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsAsyncService analyticsAsyncService;

    public AnalyticsController(AnalyticsAsyncService analyticsAsyncService) {
        this.analyticsAsyncService = analyticsAsyncService;
    }

    @GetMapping
    public CompletableFuture<ResponseEntity<Map<String, Object>>> getAnalytics() {
        return analyticsAsyncService.computeAnalyticsAsync()
            .thenApply(ResponseEntity::ok);
    }

    @PostMapping("/recalculate-scores")
    public CompletableFuture<ResponseEntity<Map<String, String>>> recalculateScores() {
        return analyticsAsyncService.recalculateAllRelationshipScoresAsync()
            .thenApply(success -> ResponseEntity.ok(Map.of("message", "Multithreaded score recalculation complete", "status", "SUCCESS")));
    }
}
