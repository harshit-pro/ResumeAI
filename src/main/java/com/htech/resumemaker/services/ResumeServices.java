package com.htech.resumemaker.services;

import com.htech.resumemaker.dto.FormRequest;
import com.htech.resumemaker.dto.ResumeRequest;
import com.htech.resumemaker.dto.ResumeResponse;
import com.htech.resumemaker.model.Resume;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface ResumeServices {
    Map<String, Object> generateResumeResponse(String userResumeDescription)  throws IOException;

    Map<String, Object>  generateResume(ResumeRequest request, String username,String userResumeDescription) throws IOException;
    List<ResumeResponse> getUserResumes(String clerkId);

    @Transactional
    Map<String, Object> saveResume(ResumeResponse request, String username);

    ResumeResponse getResumeById(Long id, String username);

    ResumeResponse updateResume(Long id, FormRequest request, String username) throws IOException;

    void deleteResume(Long id, String username);

    ResumeResponse createResume(FormRequest request, String username);

//    Object mapToResponse(Resume resume);
}