package com.paisafy.backend.service;

import com.paisafy.backend.model.Transaction;
import com.paisafy.backend.model.User;
import com.paisafy.backend.payload.request.TransactionRequest;
import com.paisafy.backend.repository.TransactionRepository;
import com.paisafy.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    TransactionRepository transactionRepository;

    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public Transaction createTransaction(String userId, TransactionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Transaction transaction = Transaction.builder()
                .user(user)
                .amount(request.getAmount())
                .type(request.getType())
                .category(request.getCategory())
                .description(request.getDescription())
                .date(request.getDate())
                .build();

        return transactionRepository.save(transaction);
    }

    @Override
    public Page<Transaction> getAllTransactions(String userId, Pageable pageable) {
        return transactionRepository.findByUserId(userId, pageable);
    }

    @Override
    @Transactional
    public void deleteTransaction(String id, String userId) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        // Use equals() for String comparison
        if (!transaction.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        transactionRepository.delete(transaction);
    }
}
