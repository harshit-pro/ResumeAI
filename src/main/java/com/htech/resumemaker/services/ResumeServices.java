//package services;
package services;

import org.springframework.stereotype.Service;

import java.io.IOException;
@Service
public interface ResumeServices {
    // interface isliye agar future me implementation badalna chao to badal
//    sakte ho
    String generateResumeResponse(String userResumeDescription) throws IOException;

}
