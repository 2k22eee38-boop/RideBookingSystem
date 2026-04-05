package com.example.ride.service;

import com.example.ride.dto.UserRequest;
import com.example.ride.entity.User;
import com.example.ride.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User registerUser(UserRequest request) {

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());

        return userRepository.save(user);
    }

    @Override
    public User login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(!user.getPassword().equals(password)){
            throw new RuntimeException("Invalid credentials");
        }

        return user;
    }

    @Override
    public List<User> getAvailableDrivers() {
        return userRepository.findByRoleAndAvailabilityStatus("DRIVER","AVAILABLE");
    }
}
