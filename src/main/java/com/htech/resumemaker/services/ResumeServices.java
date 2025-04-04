//package services;
package com.htech.resumemaker.services;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

@Service
public interface ResumeServices {
    // interface isliye agar future me implementation badalna chao to badal
//    sakte ho
    Map<String, Object> generateResumeResponse(String userResumeDescription) throws IOException;

}
