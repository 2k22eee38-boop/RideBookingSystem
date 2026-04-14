package com.example.ride.service;

import com.example.ride.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DriverAssignmentService {

    private final UserService userService;

    public User assignDriver() {
        List<User> drivers = userService.getAvailableDrivers();
        if (drivers.isEmpty()) {
            throw new RuntimeException("No drivers available");
        }
        Collections.shuffle(drivers);
        return drivers.get(0);
    }
}