package com.example.ride.controller;

import com.example.ride.dto.LoginRequest;
import com.example.ride.dto.UserRequest;
import com.example.ride.entity.User;
import com.example.ride.security.JwtUtil;
import com.example.ride.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody UserRequest request){
        User user = userService.registerUser(request);
        return ResponseEntity.ok(buildAuthResponse(user));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request){
        User user = userService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(buildAuthResponse(user));
    }

    private Map<String, Object> buildAuthResponse(User user) {
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        return response;
    }
}