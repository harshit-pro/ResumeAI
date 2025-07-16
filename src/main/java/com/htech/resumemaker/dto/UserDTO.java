package com.htech.resumemaker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UserDTO {
    private String clerkId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String password;
    private String photoUrl;
    private Integer credits;
}
