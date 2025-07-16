package com.htech.resumemaker.services;

import com.htech.resumemaker.dto.UserDTO;


public interface UserService {

    UserDTO saveUser(UserDTO userDto);

    UserDTO getUserByClerkId(String clerkId);
    void deleteUserByClerkId(String clerkId);
}
