package com.paisafy.backend.payload.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class FundGoalRequest {
    @NotNull
    @Positive
    private BigDecimal amount;
}
