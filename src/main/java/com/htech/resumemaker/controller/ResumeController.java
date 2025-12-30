

package com.htech.resumemaker.controller;

import com.htech.resumemaker.dto.FormRequest;
import com.htech.resumemaker.dto.ResumeRequest;
import com.htech.resumemaker.dto.ResumeResponse;
import com.htech.resumemaker.model.Resume;
import com.htech.resumemaker.services.ResumeServices;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
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
            Map<String,Object> response = resumeServices.generateResume(request, username, request.userDescription());


            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error generating resume: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Failed to generate resume: " + e.getMessage()
                    ));
        }
    }
    @PostMapping("/save")
    public ResponseEntity<ResumeResponse> saveResume(
            @RequestBody FormRequest request,
            Authentication authentication
    ) {
        String username = authentication.getName();
        ResumeResponse savedResume = resumeServices.createResume(request, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedResume);
    }



@GetMapping("/user")
public ResponseEntity<List<ResumeResponse>> getUserResumes(Authentication authentication) {

    System.out.println("Fetching resumes for user: " + authentication.getName());
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

@PostMapping
public ResponseEntity<ResumeResponse> createResume(
        @RequestBody FormRequest request,
        Authentication authentication) throws IOException {
    String username = authentication.getName();
    ResumeResponse newResume = resumeServices.createResume(request, username);
    return ResponseEntity.status(HttpStatus.CREATED).body(newResume);
}

@PutMapping("/{id}")
public ResponseEntity<ResumeResponse> updateResume(
        @PathVariable Long id,
         @RequestBody FormRequest request,
        Authentication authentication) throws IOException {
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
