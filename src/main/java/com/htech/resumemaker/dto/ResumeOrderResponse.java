package com.htech.resumemaker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResumeOrderResponse {
    private boolean success;
    private HttpStatus statusCode;
    private Object data;
}
