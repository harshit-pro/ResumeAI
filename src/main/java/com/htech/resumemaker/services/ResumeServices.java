package com.htech.resumemaker.services;

import com.htech.resumemaker.dto.ResumeRequest;
import com.htech.resumemaker.dto.ResumeResponse;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface ResumeServices {
    Map<String, Object> generateResumeResponse(String userResumeDescription);

    ResumeResponse generateAndSaveResume(ResumeRequest request, String username);

    List<ResumeResponse> getUserResumes(String username);

    ResumeResponse getResumeById(Long id, String username);

    ResumeResponse updateResume(Long id, ResumeRequest request, String username);

    void deleteResume(Long id, String username);
}