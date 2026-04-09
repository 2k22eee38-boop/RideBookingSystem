package com.example.ride.service;

import com.example.ride.dto.RideRequest;
import com.example.ride.entity.Ride;
import com.example.ride.entity.User;
import com.example.ride.repository.RideRepository;
import com.example.ride.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RideServiceImpl implements RideService {

    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final DriverAssignmentService driverService;
    private final FareCalculationService fareService;

    @Override
    public Ride requestRide(RideRequest request) {

        User driver = driverService.assignDriver();

        Ride ride = new Ride();

        ride.setCustomerId(request.getCustomerId());
        ride.setDriverId(driver.getId());
        ride.setPickupLocation(request.getPickupLocation());
        ride.setDropLocation(request.getDropLocation());
        ride.setFare(fareService.calculateFare());
        ride.setStatus("REQUESTED");
        ride.setRequestedAt(LocalDateTime.now());

        return rideRepository.save(ride);
    }

    @Override
    public Ride updateRideStatus(Long id, String status) {

        Ride ride = rideRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        ride.setStatus(status);

        return rideRepository.save(ride);
    }

    @Override
    public Ride rateRide(Long id, Integer rating) {
        Ride ride = rideRepository.findById(id).orElseThrow(() -> new RuntimeException("Ride not found"));
        ride.setRating(rating);

        User driver = userRepository.findById(ride.getDriverId()).orElseThrow(() -> new RuntimeException("Driver not found"));
        int earnedPoints = 0;
        if(rating != null) {
            if(rating == 3) earnedPoints = 1;
            else if(rating == 4) earnedPoints = 2;
            else if(rating == 5) earnedPoints = 3;
        }
        
        if (earnedPoints > 0) {
            driver.setPoints((driver.getPoints() != null ? driver.getPoints() : 0) + earnedPoints);
            driver.setBonus((driver.getBonus() != null ? driver.getBonus() : 0.0) + (earnedPoints * 5.0));
            userRepository.save(driver);
        }
        
        return rideRepository.save(ride);
    }

    @Override
    public java.util.List<Ride> getRidesForDriver() {
        return rideRepository.findAll(); // Simplified for demo
    }

    @Override
    public java.util.List<Ride> getAllRides() {
        return rideRepository.findAll();
    }
}