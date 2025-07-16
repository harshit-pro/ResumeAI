package com.htech.resumemaker.controller;

import com.htech.resumemaker.response.UserResponse;
import com.htech.resumemaker.dto.UserDTO;
import com.htech.resumemaker.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/resume")
@RequiredArgsConstructor
public class UserController {

    // This controller can be extended with methods for user-related operations
    // such as fetching user details, updating profiles, etc.
    // Currently, it serves as a placeholder for future user-related endpoints.
    private final UserService userService;

    @PostMapping("/create-user")
    public ResponseEntity<?> createOrUpdateUser(@RequestBody UserDTO userDTO, Authentication authentication) {
        // This method is intended to create or update a user based on the provided UserDTO.
        // The authentication parameter can be used to get the currently authenticated user if needed.
        UserResponse userResponse = null;
        try {
            if (!authentication.getName().equals(userDTO.getClerkId())) {
                System.out.println("Unauthorized access attempt by: " + authentication.getName());
                userResponse = UserResponse.builder()
                        .success(false)
                        .statusCode(HttpStatus.FORBIDDEN)
                        .data("You are not authorized to update this user.")
                        .build();
                System.out.println("Unauthorized access attempt by: " + authentication.getName());
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(userResponse);
            }
            UserDTO user = userService.saveUser(userDTO);
            userResponse = UserResponse.builder()
                    .success(true)
                    .statusCode(HttpStatus.CREATED)
                    .data("User created or updated successfully: " + user.getEmail())
                    .build();
            System.out.println("User created or updated successfully: " + user.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(userResponse);
        } catch (Exception e) {
            userResponse = UserResponse.builder()
                    .success(false)
                    .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .data("Error occurred while creating or updating user: " + e.getMessage())
                    .build();
        }
        return ResponseEntity.status(userResponse.getStatusCode()).body(userResponse);
    }

    @GetMapping("/credits")
    public ResponseEntity<?> getUserCredits(Authentication authentication) {
        System.out.println("Fetching user credits for: " + authentication.getName());
        UserResponse response = null;
        try {
            if (authentication.getName().isEmpty() || authentication.getName() == null) {
                response = UserResponse.builder()
                        .success(false)
                        .statusCode(HttpStatus.UNAUTHORIZED)
                        .data("Unauthorized access: No authenticated user found.")
                        .build();
                System.out.println("Unauthorized access attempt by: " + authentication.getName());
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }
            String clerkId = authentication.getName();
            UserDTO existingUser = userService.getUserByClerkId(clerkId);
            Map<String, Integer> map = new HashMap<>();
            // used map because we want to return a key-value pair
            // where key is "credits" and value is the user's credits
            map.put("credits", existingUser.getCredits());
            response = UserResponse.builder()
                    .success(true)
                    .statusCode(HttpStatus.OK)
                    .data(map)
                    .build();
            System.out.println("User credits retrieved successfully for: " + clerkId);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            response = UserResponse.builder()
                    .success(false)
                    .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .data("Error retrieving user credits: " + e.getMessage())
                    .build();
            System.out.println("Error retrieving user credits for: " + authentication.getName() + " - " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Deduct credits from a user's account when they use a service
     */
    @PostMapping("/users/deduct-credit")
    public ResponseEntity<?> deductCredit(@RequestBody Map<String, String> request, Authentication authentication) {
        UserResponse response = null;
        try {
            // Validate authentication
            if (authentication == null || authentication.getName() == null || authentication.getName().isEmpty()) {
                response = UserResponse.builder()
                        .success(false)
                        .statusCode(HttpStatus.UNAUTHORIZED)
                        .data("Unauthorized access: No authenticated user found.")
                        .build();
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            // Get the service type from the request
            String serviceType = request.get("serviceType");
            if (serviceType == null || serviceType.isEmpty()) {
                response = UserResponse.builder()
                        .success(false)
                        .statusCode(HttpStatus.BAD_REQUEST)
                        .data("Service type is required.")
                        .build();
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // Get the user's clerkId
            String clerkId = authentication.getName();

            // Get the user's current credits
            UserDTO user = userService.getUserByClerkId(clerkId);
            Integer currentCredits = user.getCredits();

            if (currentCredits == null || currentCredits <= 0) {
                response = UserResponse.builder()
                        .success(false)
                        .statusCode(HttpStatus.BAD_REQUEST)
                        .data("Insufficient credits. Please purchase more credits to continue.")
                        .build();
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // Determine credit cost based on service type
            int creditCost = 1; // Default cost is 1 credit
            switch (serviceType) {
                case "resume_analysis":
                    creditCost = 1; // Example cost for resume analysis
                    break;
                case "resume_build":
                    creditCost = 1;
                    break;
                // Add more service types and their costs as needed
            }
            // Check if user has enough credits
            if (currentCredits < creditCost) {
                response = UserResponse.builder()
                        .success(false)
                        .statusCode(HttpStatus.BAD_REQUEST)
                        .data("Insufficient credits for this service. Required: " + creditCost + ", Available: " + currentCredits)
                        .build();
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            // Deduct credits
            user.setCredits(currentCredits - creditCost);
            // Save the updated user
            UserDTO updatedUser = userService.saveUser(user);
            // Return the response with updated credits
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("credits", updatedUser.getCredits());
            responseData.put("service", serviceType);
            responseData.put("cost", creditCost);
            response = UserResponse.builder()
                    .success(true)
                    .statusCode(HttpStatus.OK)
                    .data(responseData)
                    .build();
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            response = UserResponse.builder()
                    .success(false)
                    .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .data("Error deducting credits: " + e.getMessage())
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}