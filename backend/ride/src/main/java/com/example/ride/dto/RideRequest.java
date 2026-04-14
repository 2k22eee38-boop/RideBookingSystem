package com.example.ride.dto;

import lombok.Data;

@Data
public class RideRequest {

    private Long customerId;
    private Long driverId;
    private String pickupLocation;
    private String dropLocation;
}