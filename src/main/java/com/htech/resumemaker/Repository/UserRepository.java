package com.htech.resumemaker.Repository;

import com.htech.resumemaker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByClerkId(String clerkId);
    Optional<User> findByClerkId(String clerkId);
    boolean existsByEmail(String email);
//    Optional<User> findByUsername(String username);

    Optional<User> findById(Long userId);
}