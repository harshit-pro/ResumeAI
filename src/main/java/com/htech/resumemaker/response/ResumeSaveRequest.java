package com.htech.resumemaker.response;

import java.util.Map;

public record ResumeSaveRequest(
        String title,
        Map<String, Object> content
) {}