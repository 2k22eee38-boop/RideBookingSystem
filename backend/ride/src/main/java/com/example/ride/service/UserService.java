package com.example.ride.service;

import com.example.ride.entity.User;
import com.example.ride.dto.UserRequest;

import java.util.List;

public interface UserService {

    User registerUser(UserRequest request);

    User login(String email, String password);

    List<User> getAvailableDrivers();
}