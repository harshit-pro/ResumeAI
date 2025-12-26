package com.htech.resumemaker.services;
import com.htech.resumemaker.Repository.UserRepository;
import com.htech.resumemaker.dto.UserDTO;
import com.htech.resumemaker.model.User;
import com.htech.resumemaker.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDTO saveUser(UserDTO userDto) {
        User userToSave;
        Optional<User> optionalUser = userRepository.findByClerkId(userDto.getClerkId());

        if (optionalUser.isPresent()) {
            // Update existing user
            userToSave = optionalUser.get();

            userToSave.setFirstName(userDto.getFirstName());
            userToSave.setLastName(userDto.getLastName());
            userToSave.setCredits(userDto.getCredits());
            // Only update password if it's provided
            if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
                userToSave.setPassword(passwordEncoder.encode(userDto.getPassword()));
            }
            // Only update credits if they're provided
            if (userDto.getCredits() != null) {
                userToSave.setCredits(userDto.getCredits());
            }
        } else {
            // Create new user
            userToSave = new User();
            userToSave.setClerkId(userDto.getClerkId());
            userToSave.setUsername(userDto.getUsername() != null ? userDto.getUsername() : userDto.getEmail());
            userToSave.setEmail(userDto.getEmail());
            userToSave.setFirstName(userDto.getFirstName());
            userToSave.setLastName(userDto.getLastName());

            // Set default credits for new users
            userToSave.setCredits(userDto.getCredits() != null ? userDto.getCredits() : 5);

            // Set password if provided, otherwise use a default secure one
            if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
                userToSave.setPassword(passwordEncoder.encode(userDto.getPassword()));
            } else {
                userToSave.setPassword(passwordEncoder.encode("clerktest"));
            }
        }
        try {
            User savedUser = userRepository.save(userToSave);
            return mapToDto(savedUser);
        }catch (Exception e) {
            throw new RuntimeException("Failed to save user: " + e.getMessage());
        }
         // Debugging line

    }

//    @Override
//    public UserDTO saveUser(UserDTO userDto) {
//        System.out.println("Saving user with data: " + userDto); // Add this
//
//        Optional<User> optionalUser = userRepository.findByClerkId(userDto.getClerkId());
//        if (optionalUser.isPresent()) {
//            User existingUser = optionalUser.get();
//            System.out.println("Existing user before update: " + existingUser); // Add this
//
//            existingUser.setEmail(userDto.getEmail());
//            existingUser.setUsername(userDto.getUsername());
//            existingUser.setFirstName(userDto.getFirstName());
//            existingUser.setLastName(userDto.getLastName());
//            existingUser.setProfilePicture(userDto.getPhotoUrl());
//            if (userDto.getCredits() != null) {
//                existingUser.setCredits(userDto.getCredits());
//            }
//
//            User savedUser = userRepository.save(existingUser);
//            System.out.println("Existing user after update: " + savedUser); // Add this
////            return mapToDto(savedUser);
//            return mapToDto(savedUser);
//        }
//        User newUser = mapToEntity(userDto);
//        User savedNewUser = userRepository.save(newUser);
//        return mapToDto(savedNewUser);
//    }
        private UserDTO mapToDto (User savedUser){
            return UserDTO.builder()
                    .email(savedUser.getEmail())
                    .firstName(savedUser.getFirstName())
                    .lastName(savedUser.getLastName())
                    .clerkId(savedUser.getClerkId())
                    .credits(savedUser.getCredits())
                    .build();
        }
    private User mapToEntity(UserDTO userDto) {
        System.out.println("Mapping UserDTO to User entity: " + userDto);
        return  User.builder()
                .clerkId(userDto.getClerkId())
                .username(userDto.getUsername())
                .firstName(userDto.getFirstName())
                .lastName(userDto.getLastName())
                .email(userDto.getEmail())
                .credits(userDto.getCredits() != null ? userDto.getCredits() : 5)
                .build();

        // Only encode password if present, else use a default or null (as per your security model)
    }
        public UserDTO getUserByClerkId (String clerkId){
            User userEntity = userRepository.findByClerkId(clerkId).orElseThrow(() ->
                    new UsernameNotFoundException("1.User not found with clerkId: " + clerkId));
            return mapToDto(userEntity);

        }
        public void deleteUserByClerkId (String clerkId){
            User userEntity = userRepository.findByClerkId(clerkId).orElseThrow(() ->
                    new UsernameNotFoundException("User not found with clerkId: " + clerkId));
            userRepository.delete(userEntity);

        }
    }



//
//
//        User user = User.builder()
//                .email(signupRequest.getEmail())
//                .password(passwordEncoder.encode(signupRequest.getPassword()))
//                .fullName(signupRequest.getFullName())
//                .profession(signupRequest.getProfession())
//                .experienceLevel(signupRequest.getExperienceLevel())
//                .skills(signupRequest.getSkills())
//                .role("USER") // Default role, can be changed as needed
//                .build();
//
//        return userRepository.save(user);
//    }
//
//    @Override
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
//
//        return org.springframework.security.core.userdetails.User
//                .withUsername(user.getEmail())
//                .password(user.getPassword())
//                .roles(user.getRole())
//                .build();
//    }
//
//    public Map<String, Object> authenticateUser(String email, String password) {
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
//
//        if (!passwordEncoder.matches(password, user.getPassword())) {
//            throw new RuntimeException("Invalid credentials");
//        }
//
//        return Map.of(
//                "userId", user.getId(),
//                "email", user.getEmail(),
//                "fullName", user.getFullName(),
//                "profession", user.getProfession(),
//                "experienceLevel", user.getExperienceLevel(),
//                "skills", user.getSkills()
//        );
//    }
//}


