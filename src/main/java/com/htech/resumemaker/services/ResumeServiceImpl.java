//package com.htech.resumemaker.services;
//
//import com.fasterxml.jackson.databind.JsonNode;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.htech.resumemaker.Repository.UserRepository;
//import com.htech.resumemaker.dto.ResumeRequest;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.core.io.ClassPathResource;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//import org.springframework.util.StreamUtils;
//import org.springframework.web.reactive.function.client.WebClient;
//import org.springframework.web.reactive.function.client.WebClientResponseException;
//
//import java.io.IOException;
//import java.io.InputStream;
//import java.nio.charset.StandardCharsets;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.util.HashMap;
//import java.util.Map;
//import java.util.Objects;
//import java.util.Optional;
//
//@Service
//public class ResumeServiceImpl implements ResumeServices {
//
//    private final WebClient webClient;
//    private final UserRepository userRepository;
//
//    @Value("${gemini.api.key}")  // Fetch API Key from application.properties
//    private String apiKey;
//
//    public ResumeServiceImpl(WebClient.Builder webClientBuilder, UserRepository userRepository) {
//        this.webClient = webClientBuilder.baseUrl("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent").build();
//        this.userRepository = userRepository;
//    }
//
//    @Override
//    public Map<String, Object> generateResumeResponse(String userResumeDescription) throws IOException {
//        // Check for null userResumeDescription
//        Objects.requireNonNull(userResumeDescription, "User description cannot be null.");
//
//        String promptString = this.loadPromptFromFile();
//        // Check for null promptString
//        Objects.requireNonNull(promptString, "Prompt string cannot be null.");
//
//        String promptContent = this.putValuesToTemplate(promptString, Map.of(
//                "userDescription", userResumeDescription
//        ));
//        // Check for null promptContent
//        Objects.requireNonNull(promptContent, "Prompt content cannot be null.");
//
//        // Prepare the request payload for requesting structured data from Gemini API
//        Map<String, Object> requestBody = new HashMap<>();
//        requestBody.put("contents", new Object[]{
//                Map.of("parts", new Object[]{Map.of("text", promptContent)})
//        });
//
//        // Add generationConfig to the request payload
//        Map<String, Object> generationConfig = new HashMap<>();
//        generationConfig.put("response_mime_type", "application/json");
//        generationConfig.put("response_schema", Map.of(
//                "type", "OBJECT",
//                "properties", Map.of(
//                        "generated_text", Map.of("type", "STRING")
//                )
//        ));
//        requestBody.put("generationConfig", generationConfig);
//
//        try {
//            // Call Gemini API using WebClient with API key in headers
//            String response = webClient.post()
//                    .uri(uriBuilder -> uriBuilder.queryParam("key", apiKey).build())
//                    .bodyValue(requestBody)
//                    .retrieve()
//                    .bodyToMono(String.class)
//                    .block(); // Blocking call (for simplicity)
//
//            // Properly parse the response and return a Map
//            return parseGeminiResponse(response);
//        } catch (WebClientResponseException e) {
//            // Log the error response body for debugging
//            System.err.println("Error Response: " + e.getResponseBodyAsString());
//            throw e;
//        }
//    }
//
//    // Improved response parsing method
//    private Map<String, Object> parseGeminiResponse(String response) {
//        Map<String, Object> parsedResponse = new HashMap<>();
//
//        try {
//            // Add the raw response for debugging purposes
//            parsedResponse.put("rawResponse", response);
//
//            // Use Jackson for proper JSON parsing
//            ObjectMapper mapper = new ObjectMapper();
//            JsonNode rootNode = mapper.readTree(response);
//
//            // Extract candidates from Gemini response
//            JsonNode candidates = rootNode.path("candidates");
//            if (!candidates.isMissingNode() && candidates.isArray() && candidates.size() > 0) {
//                JsonNode firstCandidate = candidates.get(0);
//                JsonNode content = firstCandidate.path("content");
//
//                if (!content.isMissingNode()) {
//                    JsonNode parts = content.path("parts");
//
//                    if (!parts.isMissingNode() && parts.isArray() && parts.size() > 0) {
//                        JsonNode text = parts.get(0).path("text");
//
//                        if (!text.isMissingNode()) {
//                            // Get the text content which should be a JSON string
//                            String textContent = text.asText();
//
//                            try {
//                                // Try to parse the text as JSON
//                                JsonNode resumeData = mapper.readTree(textContent);
//                                parsedResponse.put("generatedResume", resumeData);
//                            } catch (Exception e) {
//                                // If it's not valid JSON, just store the raw text
//                                parsedResponse.put("generatedResume", textContent);
//                                parsedResponse.put("parsingError", "Generated content is not valid JSON");
//                            }
//                        }
//                    }
//                }
//            }
//
//            return parsedResponse;
//        } catch (Exception e) {
//            // If parsing fails, return the raw response with an error message
//            parsedResponse.put("parsingError", "Failed to parse Gemini response: " + e.getMessage());
//            return parsedResponse;
//        }
//    }
//
//    @Override
//    public boolean saveResume(String userId, ResumeRequest resumeRequest) {
//        return false;
//    }

package com.htech.resumemaker.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.htech.resumemaker.Repository.ResumeRepo;
import com.htech.resumemaker.Repository.UserRepository;
import com.htech.resumemaker.dto.ResumeRequest;
import com.htech.resumemaker.dto.ResumeResponse;
import com.htech.resumemaker.model.Resume;
import com.htech.resumemaker.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StreamUtils;
import org.springframework.web.reactive.function.client.WebClient;


import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ResumeServiceImpl implements ResumeServices {

    private final WebClient webClient;
    private final UserRepository userRepository;
    private final ResumeRepo resumeRepository;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    public ResumeServiceImpl(WebClient.Builder webClientBuilder,
                             UserRepository userRepository,
                             ResumeRepo resumeRepository,
                             ObjectMapper objectMapper) {
        this.webClient = webClientBuilder.baseUrl("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent").build();
        this.userRepository = userRepository;
        this.resumeRepository = resumeRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public ResumeResponse generateAndSaveResume(ResumeRequest request, String username) {
        // Generate resume content using AI
        Map<String, Object> generatedContent = generateResumeResponse(request.userDescription());

        // Get user from database
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Create and save resume
        Resume resume = new Resume();
        resume.setTitle(request.title() != null ? request.title() : "My Resume");
        resume.setContent(generatedContent);
        resume.setUser(user);
        resume.setCreatedAt(LocalDateTime.now());
        resume.setUpdatedAt(LocalDateTime.now());

        Resume savedResume = resumeRepository.save(resume);

        return mapToResponse(savedResume);
    }

    @Override
    public List<ResumeResponse> getUserResumes(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return resumeRepository.findByUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ResumeResponse getResumeById(Long id, String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Resume resume = resumeRepository.findByIdAndUser(id, user);

        return mapToResponse(resume);
    }

    @Override
    @Transactional
    public ResumeResponse updateResume(Long id, ResumeRequest request, String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Resume resume = resumeRepository.findByIdAndUser(id, user)
                ;

        // Generate new content if description changed
        if (request.userDescription() != null && !request.userDescription().isEmpty()) {
            Map<String, Object> generatedContent = generateResumeResponse(request.userDescription());
            resume.setContent(generatedContent);
        }

        if (request.title() != null) {
            resume.setTitle(request.title());
        }

        resume.setUpdatedAt(LocalDateTime.now());

        Resume updatedResume = resumeRepository.save(resume);
        return mapToResponse(updatedResume);
    }

    @Override
    @Transactional
    public void deleteResume(Long id, String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Resume resume = resumeRepository.findByIdAndUser(id, user);


        resumeRepository.delete(resume);
    }

    @Override
    public Map<String, Object> generateResumeResponse(String userResumeDescription) {
        try {
            Objects.requireNonNull(userResumeDescription, "User description cannot be null.");

            String promptString = this.loadPromptFromFile();
            Objects.requireNonNull(promptString, "Prompt string cannot be null.");

            String promptContent = this.putValuesToTemplate(promptString, Map.of(
                    "userDescription", userResumeDescription
            ));
            Objects.requireNonNull(promptContent, "Prompt content cannot be null.");

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", new Object[]{
                    Map.of("parts", new Object[]{Map.of("text", promptContent)})
            });

            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("response_mime_type", "application/json");
            generationConfig.put("response_schema", Map.of(
                    "type", "OBJECT",
                    "properties", Map.of(
                            "generated_text", Map.of("type", "STRING")
                    )
            ));
            requestBody.put("generationConfig", generationConfig);
            String response = webClient.post()
                    .uri(uriBuilder -> uriBuilder.queryParam("key", apiKey).build())
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            return parseMultipleResponses(response);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate resume: " + e.getMessage(), e);
        }
    }

    private ResumeResponse mapToResponse(Resume resume) {
        return new ResumeResponse(
                resume.getId(),
                resume.getTitle(),
                resume.getCreatedAt(),
                resume.getUpdatedAt(),
                resume.getContent()
        );
    }


    public String loadPromptFromFile() throws IOException {
        ClassPathResource resource = new ClassPathResource("resume_prompt.txt");
        try (InputStream inputStream = resource.getInputStream()) {
            return StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
        }
    }

    private String putValuesToTemplate(String template, Map<String, String> values) {
        for (Map.Entry<String, String> entry : values.entrySet()) {
            template = template.replace("{{" + entry.getKey() + "}}", entry.getValue());
        }
        return template;
    }

    public static Map<String, Object> parseMultipleResponses(String response) {
        Map<String, Object> jsonResponse = new HashMap<>();
        // Parse the response to extract the generated text
        jsonResponse.put("generatedResume", response);
        return jsonResponse;
    }

    //

}