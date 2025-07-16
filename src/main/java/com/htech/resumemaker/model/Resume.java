package com.htech.resumemaker.model;

import com.htech.resumemaker.dto.JsonConverter;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Map;


@Entity
@Table(name = "resumes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resume {
    @Id
    @GeneratedValue
    private Long id;

    private String title;

    @Convert(converter = JsonConverter.class)
    @Column(columnDefinition = "jsonb")
    // because JPA does not support mapping a Map<String, Object> as a basic attribute.
    // To store a map as a JSON column, you need to use a converter or a supported type
    // 
    private Map<String, Object> content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}