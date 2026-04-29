package com.paisafy.backend.service;

import com.paisafy.backend.model.Goal;
import com.paisafy.backend.model.User;
import com.paisafy.backend.payload.request.FundGoalRequest;
import com.paisafy.backend.payload.request.GoalRequest;
import com.paisafy.backend.payload.response.GoalResponse;
import com.paisafy.backend.repository.GoalRepository;
import com.paisafy.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GoalService {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private UserRepository userRepository;

    public List<GoalResponse> getGoalsForUser(String userId) {
        List<Goal> goals = goalRepository.findByUserId(userId);
        
        return goals.stream().map(goal -> GoalResponse.builder()
                .id(goal.getId())
                .title(goal.getTitle())
                .targetAmount(goal.getTargetAmount())
                .savedAmount(goal.getSavedAmount())
                .color(goal.getColor())
                .icon(goal.getIcon())
                .build()).collect(Collectors.toList());
    }

    public GoalResponse createGoal(String userId, GoalRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));

        Goal goal = Goal.builder()
                .user(user)
                .title(request.getTitle())
                .targetAmount(request.getTargetAmount())
                .savedAmount(request.getSavedAmount() != null ? request.getSavedAmount() : BigDecimal.ZERO)
                .color(request.getColor() != null ? request.getColor() : "bg-primary-500")
                .icon(request.getIcon() != null ? request.getIcon() : "🎯")
                .build();

        goal = goalRepository.save(goal);

        return GoalResponse.builder()
                .id(goal.getId())
                .title(goal.getTitle())
                .targetAmount(goal.getTargetAmount())
                .savedAmount(goal.getSavedAmount())
                .color(goal.getColor())
                .icon(goal.getIcon())
                .build();
    }

    public GoalResponse fundGoal(String userId, String goalId, FundGoalRequest request) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Error: Goal not found."));

        if (!goal.getUser().getId().equals(userId)) {
            throw new RuntimeException("Error: Unauthorized to modify this goal.");
        }

        goal.setSavedAmount(goal.getSavedAmount().add(request.getAmount()));
        goal = goalRepository.save(goal);

        return GoalResponse.builder()
                .id(goal.getId())
                .title(goal.getTitle())
                .targetAmount(goal.getTargetAmount())
                .savedAmount(goal.getSavedAmount())
                .color(goal.getColor())
                .icon(goal.getIcon())
                .build();
    }
}
