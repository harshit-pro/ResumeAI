package com.htech.resumemaker.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
public class ResumeServiceImpl implements ResumeServices {

    private final WebClient webClient;

    @Value("${gemini.api.key}")  // Fetch API Key from application.properties
    private String apiKey;

    public ResumeServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent").build();
    }

    @Override
    public Map<String, Object> generateResumeResponse(String userResumeDescription) throws IOException {
        // Check for null userResumeDescription
        Objects.requireNonNull(userResumeDescription, "User description cannot be null.");

        String promptString = this.loadPromptFromFile();
        // Check for null promptString
        Objects.requireNonNull(promptString, "Prompt string cannot be null.");

        String promptContent = this.putValuesToTemplate(promptString, Map.of(
                "userDescription", userResumeDescription
        ));
        // Check for null promptContent
        Objects.requireNonNull(promptContent, "Prompt content cannot be null.");

        // Prepare the request payload
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", new Object[]{
                Map.of("parts", new Object[]{Map.of("text", promptContent)})
        });

        // Add generationConfig to the request payload
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("response_mime_type", "application/json");
        generationConfig.put("response_schema", Map.of(
                "type", "OBJECT",
                "properties", Map.of(
                        "generated_text", Map.of("type", "STRING")
                )
        ));
        requestBody.put("generationConfig", generationConfig);

        try {
            // Call Gemini API using WebClient with API key in headers
            String response = webClient.post()
                    .uri(uriBuilder -> uriBuilder.queryParam("key", apiKey).build())
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block(); // Blocking call (for simplicity)

            return parseMultipleResponses(response);
        } catch (WebClientResponseException e) {
            // Log the error response body for debugging
            System.err.println("Error Response: " + e.getResponseBodyAsString());
            throw e;
        }
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
        // This is just an example; you need to adjust it based on the actual response structure
        jsonResponse.put("generatedResume", response);
        return jsonResponse;
    }
}