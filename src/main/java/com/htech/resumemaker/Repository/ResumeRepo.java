package com.htech.resumemaker.Repository;

import com.htech.resumemaker.model.Resume;
import com.htech.resumemaker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ResumeRepo extends JpaRepository<Resume, UUID> {
//    List<Resume> findByUserId(UUID userId);
    List<Resume> findByUser(User user);
    Resume findByIdAndUser(Long id, User user);
}
