//package com.htech.resumemaker.services;
//
//import com.htech.resumemaker.Repository.ResumeRepo;
//import com.htech.resumemaker.Repository.UserRepository;
//import com.htech.resumemaker.model.Resume;
//import com.htech.resumemaker.model.User;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Optional;
//import java.util.UUID;
//
//@Service
//public class ResumeDatabaseService {
//    @Autowired
//    private ResumeRepo resumeRepository;
//    @Autowired
//    UserRepository userRepository;
//
//        public Resume saveResume(UUID userId, String title, String content) {
//            User user = (User) userRepository.findById(userId)
//                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
//
//            Resume resume = new Resume();
//            resume.setTitle(title);
//            resume.setContent(content);
//            resume.setUser(user);
//            resume.setCreatedAt(LocalDateTime.now());
//            resume.setUpdatedAt(LocalDateTime.now());
//
//            return resumeRepository.save(resume);
//        }
//
//
//        public List<Resume> getUserResumes(UUID userId) {
//            return resumeRepository.findByUserId(userId);
//        }
//
//
//        public Optional<Resume> getResume(UUID resumeId) {
//            return resumeRepository.findById(resumeId);
//        }
//
//
//        public Resume updateResume(UUID resumeId, String title, String content) {
//            Resume resume = resumeRepository.findById(resumeId)
//                    .orElseThrow(() -> new RuntimeException("Resume not found with ID: " + resumeId));
//
//            resume.setTitle(title);
//            resume.setContent(content);
//            resume.setUpdatedAt(LocalDateTime.now());
//
//            return resumeRepository.save(resume);
//        }
//
//        public void deleteResume(UUID resumeId) {
//            resumeRepository.deleteById(resumeId);
//        }
//    }
