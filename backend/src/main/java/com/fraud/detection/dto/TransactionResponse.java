package com.fraud.detection.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * DTO for transaction responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {

    private UUID id;

    @JsonProperty("transaction_id")
    private String transactionId;

    @JsonProperty("user_id")
    private String userId;

    private BigDecimal amount;
    private String currency;

    @JsonProperty("source_account")
    private String sourceAccount;

    @JsonProperty("dest_account")
    private String destAccount;

    @JsonProperty("transaction_type")
    private String transactionType;

    @JsonProperty("ip_address")
    private String ipAddress;

    @JsonProperty("device_fingerprint")
    private String deviceFingerprint;

    private Map<String, Object> location;
    private Map<String, Object> metadata;

    private String status;

    @JsonProperty("risk_score")
    private Integer riskScore;

    @JsonProperty("evaluated_at")
    private Instant evaluatedAt;

    @JsonProperty("created_at")
    private Instant createdAt;

    @JsonProperty("updated_at")
    private Instant updatedAt;

    @JsonProperty("rule_evaluations")
    private List<RuleEvaluationSummary> ruleEvaluations;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RuleEvaluationSummary {
        @JsonProperty("rule_id")
        private String ruleId;
        @JsonProperty("rule_name")
        private String ruleName;
        private Boolean matched;
        private Integer weight;
        private String reason;
    }
}
