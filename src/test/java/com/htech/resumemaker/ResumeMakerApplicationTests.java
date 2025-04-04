package com.htech.resumemaker;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.htech.resumemaker.services.ResumeServices;

import java.io.IOException;

@SpringBootTest(classes = ResumeMakerApplication.class)
class ResumeMakerApplicationTests {
    @Autowired
    private ResumeServices resumeServices;

    @Test
    void contextLoads() throws IOException {
//        String userText = "I am Harshit Mishra with 2 years of experience in Java and Spring Boot";
//        System.out.println("Testing with input: " + userText); // Debugging output
//        resumeServices.generateResumeResponse(userText);
    }
}
