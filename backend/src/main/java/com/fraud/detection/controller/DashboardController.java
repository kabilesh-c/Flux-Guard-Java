package com.fraud.detection.controller;

import com.fraud.detection.repository.AlertRepository;
import com.fraud.detection.repository.TransactionRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * REST controller for dashboard analytics.
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard analytics and KPIs")
public class DashboardController {

    private final TransactionRepository transactionRepository;
    private final AlertRepository alertRepository;

    @GetMapping("/summary")
    @Operation(summary = "Get dashboard summary", description = "Retrieve KPIs and summary statistics")
    @Cacheable(value = "dashboardSummary", unless = "#result == null")
    public ResponseEntity<Map<String, Object>> getDashboardSummary() {
        Map<String, Object> summary = new HashMap<>();
        
        // Transaction counts - optimized with single query
        long totalTransactions = transactionRepository.count();
        long flaggedCount = transactionRepository.countByStatus(
                com.fraud.detection.entity.Transaction.TransactionStatus.FLAGGED);
        long approvedCount = transactionRepository.countByStatus(
                com.fraud.detection.entity.Transaction.TransactionStatus.APPROVED);
        long rejectedCount = transactionRepository.countByStatus(
                com.fraud.detection.entity.Transaction.TransactionStatus.REJECTED);
        
        summary.put("totalTransactions", totalTransactions);
        summary.put("flaggedTransactions", flaggedCount);
        summary.put("approvedTransactions", approvedCount);
        summary.put("rejectedTransactions", rejectedCount);
        
        // Alert counts
        long unreadAlerts = alertRepository.countUnreadAlerts();
        summary.put("unreadAlerts", unreadAlerts);
        
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(10, TimeUnit.SECONDS))
                .body(summary);
    }

    @GetMapping("/time-series")
    @Operation(summary = "Get time-series data", description = "Retrieve transaction trends over time")
    public ResponseEntity<Map<String, Object>> getTimeSeries() {
        Map<String, Object> data = new HashMap<>();
        
        // For now, return empty data - can be enhanced with actual time-series queries
        data.put("labels", new String[]{});
        data.put("values", new int[]{});
        
        return ResponseEntity.ok(data);
    }
}
