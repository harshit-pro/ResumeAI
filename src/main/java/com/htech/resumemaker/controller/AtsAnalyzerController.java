//package com.htech.resumemaker.controller;
//import org.springframework.http.HttpEntity;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.core.io.ByteArrayResource;
////import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpStatus;
////import org.springframework.http.MediaType;
////import org.springframework.http.ResponseEntity;
//import org.springframework.util.LinkedMultiValueMap;
//import org.springframework.util.MultiValueMap;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.client.RestTemplate;
//import org.springframework.web.multipart.MultipartFile;
//import java.util.HashMap;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/ats")
//@CrossOrigin(origins = "*")
//public class AtsAnalyzerController {
//
//    private static final String PYTHON_ATS_API_URL = "http://localhost:5005/analyze";
//
//    @PostMapping("/analyze")
//    public ResponseEntity<Map<String, Object>> analyzeResume(
//            @RequestParam("resume") MultipartFile resume,
//            @RequestParam("jobDescription") String jobDescription) {
//
//        try {
//            // Prepare request to Python ATS API....
//
//            RestTemplate restTemplate = new RestTemplate();
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
//
//            // Create multipart body
//            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
//            body.add("jobDescription", jobDescription);
//            body.add("resume", new ByteArrayResource(resume.getBytes()) {
//                @Override
//                public String getFilename() {
//                    return resume.getOriginalFilename();
//                }
//            });
//
//            HttpEntity<MultiValueMap<String, Object>> requestEntity =
//                    new HttpEntity<>(body, headers);
//
//            // Send request to Python API
//            ResponseEntity<Map> response = restTemplate.postForEntity(
//                    PYTHON_ATS_API_URL,
//                    requestEntity,
//                    Map.class
//            );
//
//            // Ensure the response is valid
//            if (response.getBody() == null) {
//                throw new Exception("Empty response from Python API");
//            }
//
//            // Return the response from Python API
//            Map<String, Object> successResponse = new HashMap<>();
//            successResponse.put("status", "success");
//            successResponse.put("data", response.getBody());
//            return ResponseEntity.ok(successResponse);
//
//        } catch (Exception e) {
//            Map<String, Object> errorResponse = new HashMap<>();
//            errorResponse.put("status", "error");
//            errorResponse.put("message", e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(errorResponse);
//        }
//    }
//}