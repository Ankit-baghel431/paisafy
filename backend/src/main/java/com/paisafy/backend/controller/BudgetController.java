package com.paisafy.backend.controller;

import com.paisafy.backend.payload.request.BudgetRequest;
import com.paisafy.backend.payload.response.BudgetResponse;
import com.paisafy.backend.security.services.UserDetailsImpl;
import com.paisafy.backend.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @GetMapping
    public ResponseEntity<List<BudgetResponse>> getAllBudgets(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        List<BudgetResponse> budgets = budgetService.getBudgetsForUser(userDetails.getId());
        return ResponseEntity.ok(budgets);
    }

    @PostMapping
    public ResponseEntity<BudgetResponse> createBudget(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody BudgetRequest request) {
        
        BudgetResponse response = budgetService.createBudget(userDetails.getId(), request);
        return ResponseEntity.ok(response);
    }
}
