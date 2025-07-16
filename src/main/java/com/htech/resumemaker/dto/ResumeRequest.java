package com.htech.resumemaker.dto;

import lombok.Getter;
import lombok.Setter;


public record ResumeRequest(

        String userDescription,
        String title
) {
}