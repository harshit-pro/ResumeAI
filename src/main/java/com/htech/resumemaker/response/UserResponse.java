package com.htech.resumemaker.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
@Builder
public class UserResponse {

    private boolean success;
    private HttpStatus statusCode;
    private Object data;
}
