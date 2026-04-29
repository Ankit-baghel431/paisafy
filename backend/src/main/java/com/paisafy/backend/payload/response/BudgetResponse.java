package com.paisafy.backend.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudgetResponse {
    private String id;
    private String category;
    private BigDecimal limitAmount;
    private BigDecimal spentAmount;
    private String color;
}
