package com.paisafy.backend.service;

import com.paisafy.backend.model.Budget;
import com.paisafy.backend.model.Transaction;
import com.paisafy.backend.model.TransactionType;
import com.paisafy.backend.model.User;
import com.paisafy.backend.payload.request.BudgetRequest;
import com.paisafy.backend.payload.response.BudgetResponse;
import com.paisafy.backend.repository.BudgetRepository;
import com.paisafy.backend.repository.TransactionRepository;
import com.paisafy.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    public List<BudgetResponse> getBudgetsForUser(String userId) {
        List<Budget> budgets = budgetRepository.findByUserId(userId);
        
        return budgets.stream().map(budget -> {
            // Dynamically calculate spent amount for the category
            List<Transaction> expenses = transactionRepository.findByUserIdAndCategoryAndType(userId, budget.getCategory(), TransactionType.EXPENSE);
            BigDecimal spentAmount = expenses.stream()
                    .map(Transaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            return BudgetResponse.builder()
                    .id(budget.getId())
                    .category(budget.getCategory())
                    .limitAmount(budget.getLimitAmount())
                    .spentAmount(spentAmount)
                    .color(budget.getColor())
                    .build();
        }).collect(Collectors.toList());
    }

    public BudgetResponse createBudget(String userId, BudgetRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));

        Budget budget = Budget.builder()
                .user(user)
                .category(request.getCategory())
                .limitAmount(request.getLimitAmount())
                .color(request.getColor() != null ? request.getColor() : "bg-blue-500")
                .build();

        budget = budgetRepository.save(budget);

        // Dynamically calculate spent amount for the new budget category
        List<Transaction> expenses = transactionRepository.findByUserIdAndCategoryAndType(userId, budget.getCategory(), TransactionType.EXPENSE);
        BigDecimal spentAmount = expenses.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return BudgetResponse.builder()
                .id(budget.getId())
                .category(budget.getCategory())
                .limitAmount(budget.getLimitAmount())
                .spentAmount(spentAmount)
                .color(budget.getColor())
                .build();
    }
}
