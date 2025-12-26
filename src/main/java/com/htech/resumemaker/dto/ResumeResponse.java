package com.htech.resumemaker.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ResumeResponse
         {
             Long id;
             String title;
             Map<String, Object> content;
             LocalDateTime createdAt;
             LocalDateTime updatedAt;

}