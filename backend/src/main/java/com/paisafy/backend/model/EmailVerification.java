package com.paisafy.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "email_verifications")
public class EmailVerification {

    @Id
    private String id;

    private String email;

    private String otp;

    private LocalDateTime expiryDate;
}
