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
public class GoalResponse {
    private String id;
    private String title;
    private BigDecimal targetAmount;
    private BigDecimal savedAmount;
    private String color;
    private String icon;
}
