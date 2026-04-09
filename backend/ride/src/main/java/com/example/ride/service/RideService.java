package com.example.ride.service;

import com.example.ride.dto.RideRequest;
import com.example.ride.entity.Ride;
import java.util.List;

public interface RideService {
    Ride requestRide(RideRequest request);
    Ride updateRideStatus(Long id, String status);
    Ride rateRide(Long id, Integer rating);
    List<Ride> getRidesForDriver();
    List<Ride> getAllRides();
}
