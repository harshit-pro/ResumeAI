package com.htech.resumemaker.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.htech.resumemaker.Repository.ResumeRepo;
import com.htech.resumemaker.Repository.UserRepository;
import com.htech.resumemaker.dto.FormRequest;
import com.htech.resumemaker.dto.ResumeRequest;
import com.htech.resumemaker.dto.ResumeResponse;
import com.htech.resumemaker.model.Resume;
import com.htech.resumemaker.model.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.util.retry.Retry;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ResumeServiceImpl implements ResumeServices {

    private final WebClient webClient;
    private final UserRepository userRepository;
    private final ResumeRepo resumeRepository;
    private final ObjectMapper objectMapper;


    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model:gemini-1.5-flash-latest}")
    private String geminiModel;

    private static final String GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/";

    public ResumeServiceImpl(WebClient.Builder webClientBuilder,
                             UserRepository userRepository,
                             ResumeRepo resumeRepository,
                             ObjectMapper objectMapper
                             ) {
        this.webClient = webClientBuilder.baseUrl(GEMINI_BASE_URL).build();
        this.userRepository = userRepository;
        this.resumeRepository = resumeRepository;
        this.objectMapper = objectMapper;
    }
    @Override
    @Transactional
    public Map<String, Object> generateResume(ResumeRequest request, String username, String userResumeDescription) throws IOException {
        // Generate resume content using AI
        Map<String, Object> generatedContent = generateResumeResponse(request.userDescription());
        log.info("Generated content: {}", generatedContent);
        return generatedContent;
    }

    @Override
    public List<ResumeResponse> getUserResumes(String clerkId) {
        User user = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return resumeRepository.findByUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> generateResumeResponse(String userResumeDescription) throws IOException {
        // Only generate content, don't save
        Objects.requireNonNull(userResumeDescription, "User description cannot be null.");

        // Validate API key
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("${GEMINI_API_KEY}")) {
            log.error("Gemini API key is not configured properly");
            throw new RuntimeException("Gemini API key is not configured. Please set GEMINI_API_KEY environment variable.");
        }

        String promptString = this.loadPromptFromFile();
        String promptContent = this.putValuesToTemplate(promptString, Map.of(
                "userDescription", userResumeDescription
        ));

        // Prepare and send request to Gemini API
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(
                Map.of("parts", List.of(Map.of("text", promptContent)))
        ));

        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("response_mime_type", "application/json");
        requestBody.put("generationConfig", generationConfig);

        log.info("Using Gemini model: {}", geminiModel);
        log.debug("Prepared request body for Gemini API: {}", objectMapper.writeValueAsString(requestBody));

        try {
            String endpoint = geminiModel + ":generateContent";
            log.info("Sending request to Gemini API endpoint: {}", endpoint);

            String response = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path(endpoint)
                            .queryParam("key", apiKey)
                            .build())
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .retryWhen(Retry.backoff(5, Duration.ofSeconds(5))
                            .maxBackoff(Duration.ofSeconds(60))
                            .jitter(0.5)
                            .filter(throwable -> {
                                if (throwable instanceof WebClientResponseException wcre) {
                                    int statusCode = wcre.getStatusCode().value();
                                    String responseBody = wcre.getResponseBodyAsString();
                                    log.warn("Gemini API returned status {}: {}", statusCode, responseBody);

                                    // Do NOT retry on 403 (Forbidden) or 400 (Bad Request) - these are config issues
                                    if (statusCode == 403 || statusCode == 400 || statusCode == 401) {
                                        log.error("Non-retryable error from Gemini API - Status: {}, Response: {}", statusCode, responseBody);
                                        return false;
                                    }
                                    // Retry on 429 (Too Many Requests), 503 (Service Unavailable), 500 (Server Error)
                                    boolean shouldRetry = statusCode == 429 || statusCode == 503 || statusCode == 500;
                                    if (shouldRetry) {
                                        log.info("Will retry request due to status code: {}", statusCode);
                                    }
                                    return shouldRetry;
                                }
                                log.warn("Non-WebClient exception, will retry: {}", throwable.getMessage());
                                return true; // Retry on network errors
                            })
                            .doBeforeRetry(retrySignal -> {
                                log.info("Retrying Gemini API request. Attempt #{}, caused by: {}",
                                        retrySignal.totalRetries() + 1,
                                        retrySignal.failure().getMessage());
                            })
                            .onRetryExhaustedThrow((retryBackoffSpec, retrySignal) -> {
                                Throwable cause = retrySignal.failure();
                                String errorMsg = "Gemini API request failed after " + retrySignal.totalRetries() + " retries.";
                                if (cause instanceof WebClientResponseException wcre) {
                                    errorMsg += " Last error: " + wcre.getStatusCode() + " - " + wcre.getResponseBodyAsString();
                                } else {
                                    errorMsg += " Last error: " + cause.getMessage();
                                }
                                throw new RuntimeException(errorMsg, cause);
                            }))
                    .block(Duration.ofSeconds(120));

            log.info("Received response from Gemini API");
            log.debug("Full response: {}", response);

            JsonNode rootNode = objectMapper.readTree(response);

            // Check for error in response
            if (rootNode.has("error")) {
                String errorMessage = rootNode.path("error").path("message").asText();
                int errorCode = rootNode.path("error").path("code").asInt();
                log.error("Gemini API returned error - Code: {}, Message: {}", errorCode, errorMessage);
                throw new RuntimeException("Gemini API error: " + errorMessage);
            }

            JsonNode candidates = rootNode.path("candidates");
            if (candidates.isEmpty() || !candidates.get(0).has("content")) {
                throw new RuntimeException("Invalid response format from Gemini API");
            }
            JsonNode content = candidates.get(0).path("content").path("parts");
            if (content.isEmpty()) {
                throw new RuntimeException("No content parts in Gemini response");
            }
            String generatedText = content.get(0).path("text").asText();
            log.debug("Generated text from Gemini API: {}", generatedText);

            try {
                // Parse the generated text as JSON
                JsonNode jsonNode = objectMapper.readTree(generatedText);
                log.debug("Parsed generated text as JSON successfully");
                return objectMapper.convertValue(jsonNode, Map.class);
            } catch (IOException e) {
                log.error("Failed to parse generated text as JSON: {}", e.getMessage());
                Map<String, Object> fallbackResult = new HashMap<>();
                fallbackResult.put("content", generatedText);
                return fallbackResult;
            }
        } catch (WebClientResponseException e) {
            log.error("Gemini API request failed - Status: {}, Body: {}", e.getStatusCode(), e.getResponseBodyAsString());
            if (e.getStatusCode().value() == 403) {
                throw new RuntimeException("Gemini API access denied (403 Forbidden). Please check: " +
                        "1) Your API key is valid, " +
                        "2) The Generative Language API is enabled in Google Cloud Console, " +
                        "3) The API key has proper permissions. Error: " + e.getResponseBodyAsString());
            }
            throw new RuntimeException("Gemini API request failed: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Error generating resume content: {}", e.getMessage());
            throw e;
        }
    }
    @Transactional
    @Override
    public Map<String, Object> saveResume(ResumeResponse request, String username) {
        // Get user from database
        User user = userRepository.findByClerkId(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Resume resume = Resume.builder()
                .title(request.getTitle() != null ? request.getTitle() : "Untitled Resume")
                .content(request.getContent())
                .user(user)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Resume savedResume = resumeRepository.save(resume);
        return Map.of(
                "status", "success",
                "resumeId", savedResume.getId(),
                "message", "Resume saved successfully"
        );
    }

    @Override
    public ResumeResponse getResumeById(Long id, String username) {
        User user = userRepository.findByClerkId(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Resume resume = resumeRepository.findByIdAndUser(id, user);
        return mapToResponse(resume);
    }

    public ResumeResponse createResume(@RequestBody FormRequest request, String username) {
        User user = userRepository.findByClerkId(username)
                .orElseThrow(() -> new UsernameNotFoundException("User with id '" + username + "' not found."));

        Resume resume = new Resume();
        resume.setTitle(request.title() != null ? request.title() : "My Resume");
        resume.setContent(request.content());
        resume.setUser(user);
        resume.setCreatedAt(LocalDateTime.now());
        resume.setUpdatedAt(LocalDateTime.now());

        Resume savedResume = resumeRepository.save(resume);
        return mapToResponse(savedResume);
    }

    @Override
    @Transactional
    public ResumeResponse updateResume(Long id, FormRequest request, String username) {
        User user = userRepository.findByClerkId(username)
                .orElseThrow(() -> new UsernameNotFoundException("User with id '" + username + "' not found."));
        Resume resume = resumeRepository.findByIdAndUser(id, user);
        if (resume == null) {
            throw new RuntimeException("Resume not found with ID: " + id + " for user: " + user.getEmail());
        }

        if (request.title() != null && !request.title().isEmpty()) {
            resume.setTitle(request.title());
        }

        if (request.content() != null && !request.content().isEmpty()) {
            resume.setContent(request.content());
        }

        Resume updatedResume = resumeRepository.save(resume);
        return mapToResponse(updatedResume);
    }

    private ResumeResponse mapToResponse(Resume resume) {
        return ResumeResponse.builder()
                .id(resume.getId())
                .title(resume.getTitle())
                .content(resume.getContent())
                .createdAt(resume.getCreatedAt())
                .updatedAt(resume.getUpdatedAt())
                .build();
    }

    @Override
    @Transactional
    public void deleteResume(Long id, String username) {
        User user = userRepository.findByClerkId(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Resume resume = resumeRepository.findByIdAndUser(id, user);
        resumeRepository.delete(resume);
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
}