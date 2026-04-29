package com.paisafy.backend.payload.request;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String fullName;
    private String mobile;
    private String dob;
    private String gender;
    private String city;
    private String language;
    private String currency;
    private String timezone;
    private String photoBase64;
}
