package com.example.ride.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String password;

    private String role; // CUSTOMER / DRIVER / ADMIN

    private Double latitude;

    private Double longitude;

    private String availabilityStatus; // AVAILABLE / BUSY
}
