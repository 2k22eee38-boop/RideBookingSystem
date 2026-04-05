package com.example.ride.service;

import com.example.ride.dto.RideRequest;
import com.example.ride.entity.Ride;
import com.example.ride.entity.User;
import com.example.ride.repository.RideRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RideServiceImpl implements RideService {

    private final RideRepository rideRepository;
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
}