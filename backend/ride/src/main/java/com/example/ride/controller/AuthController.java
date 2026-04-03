package com.example.ride.controller;

import com.example.ride.dto.LoginRequest;
import com.example.ride.dto.UserRequest;
import com.example.ride.entity.User;
import com.example.ride.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody UserRequest request){
        return userService.registerUser(request);
    }

    @PostMapping("/login")
    public User login(@RequestBody LoginRequest request){
        return userService.login(request.getEmail(), request.getPassword());
    }
}