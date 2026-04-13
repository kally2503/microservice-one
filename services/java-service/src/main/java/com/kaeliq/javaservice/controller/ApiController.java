package com.kaeliq.javaservice.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class ApiController {

    @Value("${app.version:1.0-SNAPSHOT}")
    private String appVersion;

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of(
            "status", "UP",
            "service", "java-service",
            "version", appVersion,
            "timestamp", Instant.now().toString()
        );
    }

    @GetMapping("/info")
    public Map<String, String> info() {
        return Map.of(
            "service", "java-service",
            "description", "Java Spring Boot Microservice",
            "version", appVersion,
            "build", System.getenv().getOrDefault("BUILD_NUMBER", "local")
        );
    }

    @GetMapping("/data")
    public Map<String, Object> getData() {
        return Map.of(
            "message", "Hello from Java Microservice!",
            "items", java.util.List.of(
                Map.of("id", 1, "name", "Item A", "status", "active"),
                Map.of("id", 2, "name", "Item B", "status", "active"),
                Map.of("id", 3, "name", "Item C", "status", "inactive")
            ),
            "timestamp", Instant.now().toString()
        );
    }
}
