package com.icms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.getOrDefault("email", "admin@icms.com");
        Map<String, Object> response = new HashMap<>();
        response.put("token", "mock_jwt_token_icms_2026_secure_session_key");
        response.put("user", Map.of(
            "id", 1,
            "name", "Alex Mercer",
            "email", email,
            "role", "ADMIN",
            "homeCity", "Chennai",
            "homeLatitude", 13.0827,
            "homeLongitude", 80.2707
        ));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> userData) {
        Map<String, Object> response = new HashMap<>();
        response.put("token", "mock_jwt_token_icms_2026_registered_session");
        response.put("user", Map.of(
            "id", 2,
            "name", userData.getOrDefault("name", "New User"),
            "email", userData.getOrDefault("email", "user@icms.com"),
            "role", "USER",
            "homeCity", userData.getOrDefault("homeCity", "Chennai"),
            "homeLatitude", 13.0827,
            "homeLongitude", 80.2707
        ));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        return ResponseEntity.ok(Map.of(
            "id", 1,
            "name", "Alex Mercer",
            "email", "alex@icms.org",
            "role", "ADMIN",
            "homeCityArea", "Chennai Central",
            "homeLatitude", 13.0827,
            "homeLongitude", 80.2707,
            "privacyLevel", "APPROXIMATE"
        ));
    }
}
