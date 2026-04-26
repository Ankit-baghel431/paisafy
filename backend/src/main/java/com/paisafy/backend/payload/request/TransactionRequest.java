package com.paisafy.backend.payload.request;

import com.paisafy.backend.model.TransactionType; // Import the enum
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransactionRequest {
    @NotNull
    @Positive
    private BigDecimal amount;

    @NotNull
    private TransactionType type;

    @NotNull
    private String category;

    private String description;

    @NotNull
    private LocalDate date;
}
