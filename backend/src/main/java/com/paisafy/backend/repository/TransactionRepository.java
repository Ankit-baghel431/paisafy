package com.paisafy.backend.repository;

import com.paisafy.backend.model.Transaction;
import com.paisafy.backend.model.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {
    Page<Transaction> findByUserId(String userId, Pageable pageable);
    List<Transaction> findByUserIdAndCategoryAndType(String userId, String category, TransactionType type);
}
