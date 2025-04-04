package com.htech.resumemaker.controller;

import com.htech.resumemaker.dto.EmailRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class EmailController {

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/send-email")
    public ResponseEntity<String> sendEmail(@RequestBody EmailRequest request) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(request.getEmail()); // Or use your configured email
            message.setTo("harshitmishra905872@gmail.com");
            message.setSubject("New message from " + request.getName());
            message.setText(
                    "Name: " + request.getName() + "\n" +
                            "Email: " + request.getEmail() + "\n\n" +
                            "Message: " + request.getMessage()
            );

            mailSender.send(message);
            return ResponseEntity.ok("Email sent successfully");
        } catch (Exception e) {
            e.printStackTrace(); // Log the error
            return ResponseEntity.status(500)
                    .body("Failed to send email: " + e.getMessage());
        }
    }
}