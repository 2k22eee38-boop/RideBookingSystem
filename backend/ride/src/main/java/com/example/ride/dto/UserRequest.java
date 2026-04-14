package com.example.ride.dto;
import lombok.Data;
@Data
public class UserRequest {

    private String name;
    private String email;
    private String password;
    private String phoneNumber;
    private String role;
    private String availabilityStatus;
}
