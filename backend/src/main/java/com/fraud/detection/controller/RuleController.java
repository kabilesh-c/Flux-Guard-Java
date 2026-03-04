package com.fraud.detection.controller;

import com.fraud.detection.entity.Rule;
import com.fraud.detection.repository.RuleRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for rule management.
 */
@RestController
@RequestMapping("/api/rules")
@RequiredArgsConstructor
@Tag(name = "Rules", description = "Fraud detection rule management")
public class RuleController {

    private final RuleRepository ruleRepository;

    @GetMapping
    @Operation(summary = "List all rules", description = "Get all fraud detection rules")
    public ResponseEntity<List<Rule>> getAllRules() {
        List<Rule> rules = ruleRepository.findAll();
        return ResponseEntity.ok(rules);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get rule by ID", description = "Retrieve a specific rule")
    public ResponseEntity<Rule> getRule(@PathVariable UUID id) {
        Rule rule = ruleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Rule not found: " + id));
        return ResponseEntity.ok(rule);
    }

    @PostMapping
    @Operation(summary = "Create rule", description = "Create a new fraud detection rule")
    public ResponseEntity<Rule> createRule(@RequestBody Rule rule) {
        Rule savedRule = ruleRepository.save(rule);
        return ResponseEntity.ok(savedRule);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update rule", description = "Update an existing rule")
    public ResponseEntity<Rule> updateRule(@PathVariable UUID id, @RequestBody Rule rule) {
        if (!ruleRepository.existsById(id)) {
            throw new IllegalArgumentException("Rule not found: " + id);
        }
        rule.setId(id);
        Rule updatedRule = ruleRepository.save(rule);
        return ResponseEntity.ok(updatedRule);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete rule", description = "Delete a rule")
    public ResponseEntity<Void> deleteRule(@PathVariable UUID id) {
        if (!ruleRepository.existsById(id)) {
            throw new IllegalArgumentException("Rule not found: " + id);
        }
        ruleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle")
    @Operation(summary = "Toggle rule status", description = "Activate or deactivate a rule")
    public ResponseEntity<Rule> toggleRule(@PathVariable UUID id) {
        Rule rule = ruleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Rule not found: " + id));
        rule.setActive(!rule.getActive());
        Rule updatedRule = ruleRepository.save(rule);
        return ResponseEntity.ok(updatedRule);
    }
}
