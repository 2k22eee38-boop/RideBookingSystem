package com.example.ride.service;

import com.example.ride.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DriverAssignmentService {

    private final UserService userService;

    public User assignDriver() {

        return userService.getAvailableDrivers()
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No drivers available"));
    }
}