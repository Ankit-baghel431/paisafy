package com.paisafy.backend.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class GoalRequest {
    @NotBlank
    private String title;

    @NotNull
    @Positive
    private BigDecimal targetAmount;

    private BigDecimal savedAmount;

    private String color;

    private String icon;
}
