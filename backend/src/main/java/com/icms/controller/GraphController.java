package com.icms.controller;

import com.icms.entity.Contact;
import com.icms.entity.Event;
import com.icms.entity.Interaction;
import com.icms.entity.MeetingLocation;
import com.icms.repository.ContactRepository;
import com.icms.repository.EventRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/graph")
@CrossOrigin(origins = "*")
public class GraphController {

    private final ContactRepository contactRepository;
    private final EventRepository eventRepository;

    public GraphController(ContactRepository contactRepository, EventRepository eventRepository) {
        this.contactRepository = contactRepository;
        this.eventRepository = eventRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getRelationshipGraph() {
        List<Map<String, Object>> nodes = new ArrayList<>();
        List<Map<String, Object>> edges = new ArrayList<>();

        List<Contact> contacts = contactRepository.findAll();
        List<Event> events = eventRepository.findAll();

        // 1. Contact Nodes
        for (Contact c : contacts) {
            Map<String, Object> node = new HashMap<>();
            node.put("id", "c_" + c.getId());
            node.put("label", c.getFullName());
            node.put("type", "CONTACT");
            node.put("category", c.getCategory().name());
            node.put("avatar", c.getAvatarUrl());
            nodes.add(node);

            // Add Location Nodes & Edges
            if (c.getMeetingLocations() != null) {
                for (MeetingLocation loc : c.getMeetingLocations()) {
                    String locId = "l_" + loc.getId();
                    Map<String, Object> locNode = new HashMap<>();
                    locNode.put("id", locId);
                    locNode.put("label", loc.getLocationName());
                    locNode.put("type", "LOCATION");
                    nodes.add(locNode);

                    Map<String, Object> edge = new HashMap<>();
                    edge.put("source", "c_" + c.getId());
                    edge.put("target", locId);
                    edge.put("label", "Met At");
                    edges.add(edge);
                }
            }

            // Add Interaction Edges
            if (c.getInteractions() != null) {
                for (Interaction inter : c.getInteractions()) {
                    String interId = "i_" + inter.getId();
                    Map<String, Object> interNode = new HashMap<>();
                    interNode.put("id", interId);
                    interNode.put("label", inter.getInteractionType().name() + " (" + inter.getInteractionDate().toLocalDate() + ")");
                    interNode.put("type", "INTERACTION");
                    nodes.add(interNode);

                    Map<String, Object> edge = new HashMap<>();
                    edge.put("source", "c_" + c.getId());
                    edge.put("target", interId);
                    edge.put("label", "Interacted");
                    edges.add(edge);
                }
            }
        }

        // 2. Event Nodes & Edges to Participants
        for (Event e : events) {
            String eventId = "e_" + e.getId();
            Map<String, Object> eventNode = new HashMap<>();
            eventNode.put("id", eventId);
            eventNode.put("label", e.getEventName());
            eventNode.put("type", "EVENT");
            eventNode.put("date", e.getEventDate());
            nodes.add(eventNode);

            if (e.getParticipants() != null) {
                for (Contact participant : e.getParticipants()) {
                    Map<String, Object> edge = new HashMap<>();
                    edge.put("source", eventId);
                    edge.put("target", "c_" + participant.getId());
                    edge.put("label", "Attended By");
                    edges.add(edge);
                }
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("nodes", nodes);
        response.put("edges", edges);

        return ResponseEntity.ok(response);
    }
}
