package com.paisafy.backend.payload.response;

import lombok.Data;
import java.util.List;

@Data
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String id;
    private String username;
    private String email;
    private List<String> roles;

    private String fullName;
    private String photoBase64;
    private String mobile;
    private String dob;
    private String gender;
    private String city;
    private String language;
    private String currency;
    private String timezone;

    public JwtResponse(String accessToken, String id, String username, String email, List<String> roles,
                       String fullName, String photoBase64, String mobile, String dob, String gender, String city, String language, String currency, String timezone) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
        this.fullName = fullName;
        this.photoBase64 = photoBase64;
        this.mobile = mobile;
        this.dob = dob;
        this.gender = gender;
        this.city = city;
        this.language = language;
        this.currency = currency;
        this.timezone = timezone;
    }
}
