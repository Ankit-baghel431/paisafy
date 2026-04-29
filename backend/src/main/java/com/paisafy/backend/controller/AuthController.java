package com.paisafy.backend.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paisafy.backend.model.User;
import com.paisafy.backend.model.EmailVerification;
import com.paisafy.backend.payload.request.LoginRequest;
import com.paisafy.backend.payload.request.SendOtpRequest;
import com.paisafy.backend.payload.request.SignupRequest;
import com.paisafy.backend.payload.request.ForgotPasswordRequest;
import com.paisafy.backend.payload.request.ResetPasswordRequest;
import com.paisafy.backend.payload.response.JwtResponse;
import com.paisafy.backend.payload.response.MessageResponse;
import com.paisafy.backend.repository.UserRepository;
import com.paisafy.backend.repository.EmailVerificationRepository;
import com.paisafy.backend.security.jwt.JwtUtils;
import com.paisafy.backend.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    EmailVerificationRepository emailVerificationRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        User user = userRepository.findById(userDetails.getId()).orElse(null);

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles,
                user != null ? user.getFullName() : null,
                user != null ? user.getPhotoBase64() : null,
                user != null ? user.getMobile() : null,
                user != null ? user.getDob() : null,
                user != null ? user.getGender() : null,
                user != null ? user.getCity() : null,
                user != null ? user.getLanguage() : null,
                user != null ? user.getCurrency() : null,
                user != null ? user.getTimezone() : null));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        // Save to DB
        Optional<EmailVerification> existing = emailVerificationRepository.findByEmail(request.getEmail());
        EmailVerification verification;
        if (existing.isPresent()) {
            verification = existing.get();
            verification.setOtp(otp);
            verification.setExpiryDate(LocalDateTime.now().plusMinutes(5));
        } else {
            verification = EmailVerification.builder()
                    .email(request.getEmail())
                    .otp(otp)
                    .expiryDate(LocalDateTime.now().plusMinutes(5))
                    .build();
        }
        emailVerificationRepository.save(verification);

        // Send actual email
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(request.getEmail());
            message.setSubject("Paisafy - Your Verification Code");
            message.setText("Welcome to Paisafy!\n\nYour 6-digit verification code is: " + otp + "\n\nThis code will expire in 5 minutes.\n\nThank you,\nThe Paisafy Team");
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + request.getEmail() + ": " + e.getMessage());
            return ResponseEntity.status(500).body(new MessageResponse("Error: Could not send email. Please check server email configuration."));
        }

        return ResponseEntity.ok(new MessageResponse("OTP sent successfully to " + request.getEmail()));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Verify OTP
        Optional<EmailVerification> verificationOpt = emailVerificationRepository.findByEmail(signUpRequest.getEmail());
        if (verificationOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: No OTP requested for this email."));
        }
        
        EmailVerification verification = verificationOpt.get();
        if (verification.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: OTP has expired. Please request a new one."));
        }
        
        if (!verification.getOtp().equals(signUpRequest.getOtp())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid OTP provided."));
        }

        // Create new user's account
        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .roles(new HashSet<>())
                .build();

        // Assign roles (default to ROLE_USER if none provided, simpler logic for now)
        // We will treat every user as ROLE_USER by default.
        user.getRoles().add("ROLE_USER");

        userRepository.save(user);

        // Clean up OTP after successful registration
        emailVerificationRepository.deleteByEmail(signUpRequest.getEmail());

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/forgot-password-otp")
    public ResponseEntity<?> forgotPasswordOtp(@Valid @RequestBody ForgotPasswordRequest request) {
        if (!userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email address not found."));
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        // Save to DB
        Optional<EmailVerification> existing = emailVerificationRepository.findByEmail(request.getEmail());
        EmailVerification verification;
        if (existing.isPresent()) {
            verification = existing.get();
            verification.setOtp(otp);
            verification.setExpiryDate(LocalDateTime.now().plusMinutes(5));
        } else {
            verification = EmailVerification.builder()
                    .email(request.getEmail())
                    .otp(otp)
                    .expiryDate(LocalDateTime.now().plusMinutes(5))
                    .build();
        }
        emailVerificationRepository.save(verification);

        // Send email
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(request.getEmail());
            message.setSubject("Paisafy - Password Reset Code");
            message.setText("We received a request to reset your password.\n\nYour 6-digit reset code is: " + otp + "\n\nThis code will expire in 5 minutes.\n\nIf you did not request this, please ignore this email.\n\nThank you,\nThe Paisafy Team");
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + request.getEmail() + ": " + e.getMessage());
            return ResponseEntity.status(500).body(new MessageResponse("Error: Could not send email. Please check server configuration."));
        }

        return ResponseEntity.ok(new MessageResponse("Password reset OTP sent to " + request.getEmail()));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        // Verify OTP
        Optional<EmailVerification> verificationOpt = emailVerificationRepository.findByEmail(request.getEmail());
        if (verificationOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: No reset requested for this email."));
        }

        EmailVerification verification = verificationOpt.get();
        if (verification.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: OTP has expired. Please request a new one."));
        }

        if (!verification.getOtp().equals(request.getOtp())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid OTP provided."));
        }

        // Update User Password
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found."));
        }

        User user = userOpt.get();
        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Clean up OTP
        emailVerificationRepository.deleteByEmail(request.getEmail());

        return ResponseEntity.ok(new MessageResponse("Password successfully reset!"));
    }
}
