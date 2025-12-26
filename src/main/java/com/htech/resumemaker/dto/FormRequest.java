package com.htech.resumemaker.dto;

import java.util.Map;

// This class is a placeholder for form request data.
public record FormRequest(String title,
                          Map<String, Object> content) {

     // This will hold the entire resume form data as a JSON object
}
