package com.paisafy.backend.controller;

import com.paisafy.backend.payload.request.FundGoalRequest;
import com.paisafy.backend.payload.request.GoalRequest;
import com.paisafy.backend.payload.response.GoalResponse;
import com.paisafy.backend.security.services.UserDetailsImpl;
import com.paisafy.backend.service.GoalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/goals")
public class GoalController {

    @Autowired
    private GoalService goalService;

    @GetMapping
    public ResponseEntity<List<GoalResponse>> getAllGoals(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        List<GoalResponse> goals = goalService.getGoalsForUser(userDetails.getId());
        return ResponseEntity.ok(goals);
    }

    @PostMapping
    public ResponseEntity<GoalResponse> createGoal(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody GoalRequest request) {
        
        GoalResponse response = goalService.createGoal(userDetails.getId(), request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/fund")
    public ResponseEntity<GoalResponse> fundGoal(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable String id,
            @Valid @RequestBody FundGoalRequest request) {
        
        GoalResponse response = goalService.fundGoal(userDetails.getId(), id, request);
        return ResponseEntity.ok(response);
    }
}
