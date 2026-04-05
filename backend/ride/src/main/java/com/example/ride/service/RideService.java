package com.example.ride.service;

import com.example.ride.dto.RideRequest;
import com.example.ride.entity.Ride;

public interface RideService {

    Ride requestRide(RideRequest request);

    Ride updateRideStatus(Long id, String status);
}
