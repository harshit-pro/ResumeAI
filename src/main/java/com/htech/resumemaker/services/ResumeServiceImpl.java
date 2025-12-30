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
    public ResumeServiceImpl(WebClient.Builder webClientBuilder,
                             UserRepository userRepository,
                             ResumeRepo resumeRepository,
                             ObjectMapper objectMapper,
                             @Value("${gemini.url}") String geminiUrl) {
        this.webClient = webClientBuilder.baseUrl("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent").build();
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
        System.out.println("Prepared request body for Gemini API: " + objectMapper.writeValueAsString(requestBody));

        try {
            System.out.println("Sending request to Gemini API with body: " + objectMapper.writeValueAsString(requestBody));
            String response = webClient.post()
                    .uri(uriBuilder -> uriBuilder.queryParam("key", apiKey).build())
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .retryWhen(Retry.backoff(3, Duration.ofSeconds(2)) // Retry 3 times, wait 2s, 4s, 8s...
                            .filter(throwable -> throwable instanceof WebClientResponseException.TooManyRequests)) // Only retry on 429
                    .block();
            System.out.println("Received response from Gemini API: " + response);
            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode candidates = rootNode.path("candidates");
            if (candidates.isEmpty() || !candidates.get(0).has("content")) {
                throw new RuntimeException("Invalid response format from Gemini API");
            }
            JsonNode content = candidates.get(0).path("content").path("parts");
            if (content.isEmpty()) {
                throw new RuntimeException("No content parts in Gemini response");
            }
            String generatedText = content.get(0).path("text").asText();
            System.out.println("Generated text from Gemini API: " + generatedText);
            try {
                // Parse the generated text as JSON
                JsonNode jsonNode = objectMapper.readTree(generatedText);
                System.out.println("Parsed generated text as JSON: " + jsonNode.toString());
                return objectMapper.convertValue(jsonNode, Map.class);
            } catch (IOException e) {
                System.out.println("Failed to parse generated text as JSON. Returning raw text. Error: " + e.getMessage());
                log.error("Failed to parse generated text as JSON", e);
                Map<String, Object> fallbackResult = new HashMap<>();
                fallbackResult.put("content", generatedText);
                return fallbackResult;
            }
        } catch (Exception e) {
            System.out.println("Error generating resume content: Now" + e.getMessage());
            log.error("Error generating resume content", e);
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