//package com.htech.resumemaker.controller;
//
//
//
//import com.htech.resumemaker.dto.ResumeRequest;
//import com.htech.resumemaker.model.Resume;
////import com.htech.resumemaker.services.ResumeDatabaseService;
//import com.htech.resumemaker.services.ResumeServices;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.Authentication;
//import org.springframework.web.bind.annotation.*;
//
//import java.io.IOException;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//import java.util.UUID;
//
//@RestController
//@RequestMapping("/api/v1/resume")
//@RequiredArgsConstructor
//public class ResumeController {
//
//    private final ResumeServices resumeServices;
//
//    @PostMapping("/generate")
//    public ResponseEntity<?> getResumeData(@RequestBody ResumeRequest request, Authentication authentication) {
//        try {
//            if (request == null || request.userDescription() == null || request.userDescription().trim().isEmpty()) {
//                return ResponseEntity.badRequest().body(Map.of(
//                        "error", "Description cannot be null or empty"
//                ));
//            }
//
//            // Call service method and get the Map response
//            Map<String, Object> generatedContent = resumeServices.generateResumeResponse(request.userDescription());
//
//            // Create a response
//            Map<String, Object> response = new HashMap<>();
//            response.put("status", "success");
//            response.put("data", generatedContent);
//
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of(
//                            "status", "error",
//                            "message", "Failed to generate resume: " + e.getMessage()
//                    ));
//        }
//    }
//}


package com.htech.resumemaker.controller;

import com.htech.resumemaker.dto.ResumeRequest;
import com.htech.resumemaker.dto.ResumeResponse;
import com.htech.resumemaker.model.Resume;
import com.htech.resumemaker.services.ResumeServices;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeServices resumeServices;

    @PostMapping("/generate")
    public ResponseEntity<?> generateResume(@RequestBody ResumeRequest request, Authentication authentication) {
        try {
            if (request == null || request.userDescription() == null || request.userDescription().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Description cannot be null or empty"
                ));
            }

            String username = authentication.getName();
            ResumeResponse response = resumeServices.generateAndSaveResume(request, username);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Failed to generate resume: " + e.getMessage()
                    ));
        }
    }

    @GetMapping("/user")
    public ResponseEntity<List<ResumeResponse>> getUserResumes(Authentication authentication) {
        String username = authentication.getName();
        List<ResumeResponse> resumes = resumeServices.getUserResumes(username);
        return ResponseEntity.ok(resumes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResumeResponse> getResumeById(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        ResumeResponse resume = resumeServices.getResumeById(id, username);
        return ResponseEntity.ok(resume);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResumeResponse> updateResume(
            @PathVariable Long id,
            @RequestBody ResumeRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        ResumeResponse updatedResume = resumeServices.updateResume(id, request, username);
        return ResponseEntity.ok(updatedResume);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResume(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        resumeServices.deleteResume(id, username);
        return ResponseEntity.ok().build();
    }
}

