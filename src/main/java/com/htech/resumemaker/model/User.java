package com.htech.resumemaker.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String clerkId;
    @Column(unique = true, nullable = false)
private String username;
    private String firstName;
    private String lastName;

    @Column(unique = true,nullable = false)
    private String email;
    private String password;
    private String profession;
    private String experienceLevel;
 // Assuming skills is a list of strings or a custom type, adjust as necessar
    // skills can be a list of strings or a single string with comma-separated values
    @Column(name = "skills", columnDefinition = "text")
    private String skills;

    private String profilePicture;
    private  Integer credits;

    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    private void prePersist() {
        if (credits == null) {
            credits=5; // Default credits for new users
        }
    }

}