package com.paisafy.backend.controller;

import com.paisafy.backend.model.Transaction;
import com.paisafy.backend.payload.request.TransactionRequest;
import com.paisafy.backend.security.services.UserDetailsImpl;
import com.paisafy.backend.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    TransactionService transactionService;

    @GetMapping
    public ResponseEntity<Page<Transaction>> getAllTransactions(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        // userDetails.getId() returns String now
        Page<Transaction> transactions = transactionService.getAllTransactions(userDetails.getId(), pageable);
        return ResponseEntity.ok(transactions);
    }

    @PostMapping
    public ResponseEntity<?> createTransaction(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody TransactionRequest request) {

        // userDetails.getId() returns String now
        Transaction transaction = transactionService.createTransaction(userDetails.getId(), request);
        return ResponseEntity.ok(transaction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable String id) { // Change Long to String

        transactionService.deleteTransaction(id, userDetails.getId());
        return ResponseEntity.ok("Transaction deleted successfully");
    }
}
