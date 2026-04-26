package com.paisafy.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Document(collection = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {
    @Id
    private String id;

    @DBRef
    private User user;

    private BigDecimal amount;

    private TransactionType type; // INCOME or EXPENSE

    private String category;

    private String description;

    private LocalDate date;

    // For future use with bill scanning
    private String receiptUrl;
}
