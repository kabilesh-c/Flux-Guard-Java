package com.fraud.detection.controller;

import com.fraud.detection.entity.Alert;
import com.fraud.detection.repository.AlertRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.UUID;

/**
 * REST controller for alert management.
 */
@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
@Tag(name = "Alerts", description = "Alert management and notifications")
public class AlertController {

    private final AlertRepository alertRepository;

    @GetMapping
    @Operation(summary = "List alerts", description = "Get paginated list of alerts")
    public ResponseEntity<Page<Alert>> getAlerts(
            @PageableDefault(size = 20) Pageable pageable,
            @RequestParam(required = false) String status) {
        
        Page<Alert> alerts;
        if (status != null) {
            Alert.AlertStatus alertStatus = Alert.AlertStatus.valueOf(status.toUpperCase());
            alerts = alertRepository.findByStatus(alertStatus, pageable);
        } else {
            alerts = alertRepository.findAll(pageable);
        }
        
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get alert by ID", description = "Retrieve a specific alert")
    public ResponseEntity<Alert> getAlert(@PathVariable UUID id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found: " + id));
        return ResponseEntity.ok(alert);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update alert status", description = "Change alert status")
    public ResponseEntity<Alert> updateAlertStatus(
            @PathVariable UUID id,
            @RequestParam String status) {
        
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found: " + id));
        
        Alert.AlertStatus newStatus = Alert.AlertStatus.valueOf(status.toUpperCase());
        alert.setStatus(newStatus);
        
        if (newStatus == Alert.AlertStatus.READ && alert.getReadAt() == null) {
            alert.setReadAt(Instant.now());
        }
        
        if (newStatus == Alert.AlertStatus.RESOLVED && alert.getResolvedAt() == null) {
            alert.setResolvedAt(Instant.now());
        }
        
        Alert updatedAlert = alertRepository.save(alert);
        return ResponseEntity.ok(updatedAlert);
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark alert as read", description = "Mark an alert as read")
    public ResponseEntity<Alert> markAsRead(@PathVariable UUID id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found: " + id));
        
        alert.setStatus(Alert.AlertStatus.READ);
        alert.setReadAt(Instant.now());
        
        Alert updatedAlert = alertRepository.save(alert);
        return ResponseEntity.ok(updatedAlert);
    }
}
