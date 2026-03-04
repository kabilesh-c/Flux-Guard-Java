package com.fraud.detection.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

/**
 * DTO for transaction ingestion requests.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequest {

    @NotBlank(message = "Transaction ID is required")
    @Size(max = 128, message = "Transaction ID must not exceed 128 characters")
    @JsonProperty("transaction_id")
    private String transactionId;

    @NotBlank(message = "User ID is required")
    @Size(max = 128, message = "User ID must not exceed 128 characters")
    @JsonProperty("user_id")
    private String userId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Amount must have at most 10 integer digits and 2 decimal places")
    private BigDecimal amount;

    @NotBlank(message = "Currency is required")
    @Pattern(regexp = "^[A-Z]{3}$", message = "Currency must be a valid 3-letter ISO code")
    private String currency;

    @Size(max = 64, message = "Source account must not exceed 64 characters")
    @JsonProperty("source_account")
    private String sourceAccount;

    @Size(max = 64, message = "Destination account must not exceed 64 characters")
    @JsonProperty("dest_account")
    private String destAccount;

    @JsonProperty("transaction_type")
    private String transactionType;

    @JsonProperty("ip_address")
    private String ipAddress;

    @Size(max = 128, message = "Device fingerprint must not exceed 128 characters")
    @JsonProperty("device_fingerprint")
    private String deviceFingerprint;

    @JsonProperty("location")
    private LocationData location;

    private Map<String, Object> metadata;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationData {
        private String country;
        private String city;
        private Double lat;
        private Double lon;
    }
}
