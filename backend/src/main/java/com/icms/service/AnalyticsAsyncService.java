package com.icms.service;

import com.icms.entity.Contact;
import com.icms.repository.ContactRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Demonstrates Multithreading & Async Processing in Java Spring Boot:
 * Uses ExecutorService and CompletableFuture to calculate heavy analytics
 * and update relationship strength scores without blocking the main REST API thread.
 */
@Service
public class AnalyticsAsyncService {

    // Thread pool executor dedicated to background processing tasks
    private final ExecutorService executorService = Executors.newFixedThreadPool(4);
    private final ContactRepository contactRepository;

    public AnalyticsAsyncService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    /**
     * Async task to recalculate relationship scores for all contacts in parallel.
     * Score algorithm: Base (50) + (Interactions * 5) + (Shared Events * 10) + (Meetings * 8), capped at 100.
     */
    public CompletableFuture<Boolean> recalculateAllRelationshipScoresAsync() {
        return CompletableFuture.supplyAsync(() -> {
            try {
                List<Contact> contacts = contactRepository.findAll();
                for (Contact c : contacts) {
                    int interactionCount = c.getInteractions() != null ? c.getInteractions().size() : 0;
                    int eventCount = c.getEvents() != null ? c.getEvents().size() : 0;
                    int locationCount = c.getMeetingLocations() != null ? c.getMeetingLocations().size() : 0;

                    int newScore = Math.min(100, 40 + (interactionCount * 8) + (eventCount * 12) + (locationCount * 10));
                    c.setRelationshipScore(newScore);
                }
                contactRepository.saveAll(contacts);
                return true;
            } catch (Exception e) {
                return false;
            }
        }, executorService);
    }

    /**
     * Async computation of statistical overview
     */
    public CompletableFuture<Map<String, Object>> computeAnalyticsAsync() {
        return CompletableFuture.supplyAsync(() -> {
            List<Contact> contacts = contactRepository.findAll();
            Map<String, Object> stats = new HashMap<>();

            Map<String, Integer> categoryDistribution = new HashMap<>();
            int totalInteractions = 0;

            for (Contact c : contacts) {
                String cat = c.getCategory().name();
                categoryDistribution.put(cat, categoryDistribution.getOrDefault(cat, 0) + 1);
                if (c.getInteractions() != null) {
                    totalInteractions += c.getInteractions().size();
                }
            }

            stats.put("totalContacts", contacts.size());
            stats.put("categoryDistribution", categoryDistribution);
            stats.put("totalInteractions", totalInteractions);
            stats.put("averageRelationshipScore", contacts.stream()
                .mapToInt(c -> c.getRelationshipScore() != null ? c.getRelationshipScore() : 50)
                .average().orElse(50.0));

            return stats;
        }, executorService);
    }
}
