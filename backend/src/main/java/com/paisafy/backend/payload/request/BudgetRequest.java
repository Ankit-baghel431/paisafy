package com.paisafy.backend.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BudgetRequest {
    @NotBlank
    private String category;

    @NotNull
    @Positive
    private BigDecimal limitAmount;

    private String color;
}
