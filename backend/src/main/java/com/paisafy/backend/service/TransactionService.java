package com.paisafy.backend.service;

import com.paisafy.backend.model.Transaction;
import com.paisafy.backend.payload.request.TransactionRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TransactionService {
    Transaction createTransaction(String userId, TransactionRequest request);

    Page<Transaction> getAllTransactions(String userId, Pageable pageable);

    void deleteTransaction(String id, String userId);
}
