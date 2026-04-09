package com.example.ride.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "rides")
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long customerId;

    private Long driverId;

    private String pickupLocation;

    private String dropLocation;

    private Double fare;

    private String status;

    private Integer rating;

    private LocalDateTime requestedAt;
}