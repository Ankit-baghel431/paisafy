package com.paisafy.backend.controller;

import com.paisafy.backend.model.User;
import com.paisafy.backend.payload.request.ProfileUpdateRequest;
import com.paisafy.backend.payload.response.MessageResponse;
import com.paisafy.backend.repository.UserRepository;
import com.paisafy.backend.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @PutMapping("/profile")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateProfile(@RequestBody ProfileUpdateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Optional<User> userOptional = userRepository.findById(userDetails.getId());

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Update profile fields
            user.setFullName(request.getFullName());
            user.setMobile(request.getMobile());
            user.setDob(request.getDob());
            user.setGender(request.getGender());
            user.setCity(request.getCity());
            user.setLanguage(request.getLanguage());
            user.setCurrency(request.getCurrency());
            user.setTimezone(request.getTimezone());
            
            // Update photo if provided
            if (request.getPhotoBase64() != null) {
                user.setPhotoBase64(request.getPhotoBase64());
            }

            userRepository.save(user);

            return ResponseEntity.ok(user);
        }

        return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found."));
    }
}
