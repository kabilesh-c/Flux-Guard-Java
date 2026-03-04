package com.fraud.detection;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main application class for the Fraud Detection System.
 * 
 * This Spring Boot application provides real-time fraud detection capabilities
 * including transaction monitoring, rule-based evaluation, risk scoring,
 * and alert management.
 * 
 * @author Fraud Detection Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableAsync
@EnableScheduling
@org.springframework.cache.annotation.EnableCaching
public class FraudDetectionApplication {

    public static void main(String[] args) {
        SpringApplication.run(FraudDetectionApplication.class, args);
    }
}
