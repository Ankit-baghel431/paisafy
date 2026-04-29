package com.paisafy.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;
import java.math.BigDecimal;

@Document(collection = "goals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Goal {
    @Id
    private String id;

    @DBRef
    private User user;

    private String title;

    private BigDecimal targetAmount;

    private BigDecimal savedAmount;

    private String color;

    private String icon;
}
