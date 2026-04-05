package com.example.ride.controller;

import com.example.ride.dto.RideRequest;
import com.example.ride.dto.RideStatusUpdateRequest;
import com.example.ride.entity.Ride;
import com.example.ride.service.RideService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rides")
@RequiredArgsConstructor
public class RideController {

    private final RideService rideService;

    @PostMapping
    public Ride requestRide(@RequestBody RideRequest request){
        return rideService.requestRide(request);
    }

    @PutMapping("/{id}")
    public Ride updateRide(@PathVariable Long id,
                           @RequestBody RideStatusUpdateRequest request){
        return rideService.updateRideStatus(id,request.getStatus());
    }
}