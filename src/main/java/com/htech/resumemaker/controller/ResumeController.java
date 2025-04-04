package com.htech.resumemaker.controller;


import com.htech.resumemaker.dto.ResumeRequest;
import com.htech.resumemaker.services.ResumeServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/resume")
public class ResumeController {
    @Autowired
    private ResumeServices resumeServices;

    public ResumeController(ResumeServices resumeServices) {
        this.resumeServices = resumeServices;
    }

    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> getResumeData(
            @RequestBody ResumeRequest resumeRequest
    ) throws IOException {
        Map<String, Object> stringObjectMap = resumeServices.generateResumeResponse(resumeRequest.userDescription());
        return new ResponseEntity<>(stringObjectMap, HttpStatus.OK);

    }


}





//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import org.springframework.web.reactive.function.client.WebClient;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.MediaType;
//
//import java.io.IOException;
//import java.util.Map;
//
//@Service
//class ResumeServices {
//
//
//    private final WebClient webClient;
//
//    // Your Gemini API Key
//    @Value("${gemini.api.key}")  // Fetch API Key from application.properties
//    private static String apiKey;
//    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
//
//    public ResumeServices(WebClient.Builder webClientBuilder) {
//        this.webClient = webClientBuilder.baseUrl(GEMINI_URL).build();
//    }
//
//    /**
//     * Generates resume analysis using Gemini API.
//     * @param userDescription - Resume text combined with JD.
//     * @return JSON response with JD match, missing keywords, and profile summary.
//     * @throws IOException
//     */
//    public Map<String, Object> generateResumeResponse(String userDescription) throws IOException {
//
//        // Prepare the prompt for Gemini
//        String prompt = preparePrompt(userDescription);
//
//        // Make the Gemini API request
//        String response = webClient.post()
//                .uri(GEMINI_URL)
//                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
//                .bodyValue(Map.of("contents", Map.of("parts", Map.of("text", prompt))))
//                .retrieve()
//                .bodyToMono(String.class)
//                .block();
//
//        // Parse the JSON response
//        ObjectMapper mapper = new ObjectMapper();
//        Map<String, Object> responseMap = mapper.readValue(response, Map.class);
//
//        // Return the formatted JSON response
//        return responseMap;
//    }
//
//    /**
//     * Prepares the Gemini prompt for resume analysis.
//     * @param resumeText - User resume content.
//     * @return Formatted prompt.
//     */
//    private String preparePrompt(String resumeText) {
//        return """
//        Act as an expert ATS (Applicant Tracking System) specialist with expertise in:
//        - Technical fields (Software Engineering, Data Science, Big Data Engineering)
//        - Resume optimization
//        - Job description matching
//
//        Evaluate the following resume against the job description. Provide detailed feedback,
//        considering that the job market is highly competitive.
//        Mention all missing keywords
//        Give Profile summary content with proper formated manner... with in depth changes recommendation
//        with proper headings from new Line .
//        and suggestions To improve the resume optimization
//
//        Analyze this resume against the job description. Format response with:
//        - **Bold headings** for sections
//        - Bullet points for lists
//        - Clear structure
//
//        Resume:
//        %s
//
//        Provide the response in the following JSON format ONLY:
//        {
//            "JD Match": "percentage between 0-100",
//            "MissingKeywords": ["keyword1", "keyword2", ...],
//            "Profile Summary": "detailed analysis of the match and specific improvement suggestions"
//        }
//        """.formatted(resumeText);
//    }
//}
