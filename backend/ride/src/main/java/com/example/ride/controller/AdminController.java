package com.example.ride.controller;

import com.example.ride.entity.User;
import com.example.ride.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;

    @GetMapping("/health")
    public String health(){
        return "Ride Booking API Running";
    }

    @GetMapping("/drivers")
    public List<User> getAllDrivers() {
        return userRepository.findAll().stream()
                .filter(u -> "DRIVER".equalsIgnoreCase(u.getRole()))
                .collect(Collectors.toList());
    }

    @DeleteMapping("/drivers/{id}")
    public void deleteDriver(@PathVariable Long id) {
        userRepository.deleteById(id);
    }
}