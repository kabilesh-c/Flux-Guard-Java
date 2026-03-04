package com.fraud.detection.controller;

import com.fraud.detection.dto.TransactionRequest;
import com.fraud.detection.dto.TransactionResponse;
import com.fraud.detection.entity.Transaction;
import com.fraud.detection.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST controller for transaction operations.
 */
@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Tag(name = "Transactions", description = "Transaction management and fraud evaluation")
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    @Operation(summary = "Ingest a new transaction", description = "Submit a transaction for fraud evaluation")
    public ResponseEntity<TransactionResponse> ingestTransaction(@Valid @RequestBody TransactionRequest request) {
        TransactionResponse response = transactionService.ingestTransaction(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get transaction by ID", description = "Retrieve detailed transaction information")
    public ResponseEntity<TransactionResponse> getTransaction(@PathVariable UUID id) {
        TransactionResponse response = transactionService.getTransaction(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "List transactions", description = "Get paginated list of all transactions")
    public ResponseEntity<Page<TransactionResponse>> getTransactions(
            @PageableDefault(size = 20) Pageable pageable,
            @RequestParam(required = false) String status) {
        
        Page<TransactionResponse> response;
        if (status != null) {
            Transaction.TransactionStatus txnStatus = Transaction.TransactionStatus.valueOf(status.toUpperCase());
            response = transactionService.getTransactionsByStatus(txnStatus, pageable);
        } else {
            response = transactionService.getTransactions(pageable);
        }
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/retry")
    @Operation(summary = "Retry transaction evaluation", description = "Re-evaluate a transaction for fraud")
    public ResponseEntity<TransactionResponse> retryTransaction(@PathVariable UUID id) {
        TransactionResponse response = transactionService.retryTransaction(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/reset")
    @Operation(summary = "Reset transaction", description = "Reset transaction to pending state")
    public ResponseEntity<TransactionResponse> resetTransaction(@PathVariable UUID id) {
        TransactionResponse response = transactionService.resetTransaction(id);
        return ResponseEntity.ok(response);
    }
}
