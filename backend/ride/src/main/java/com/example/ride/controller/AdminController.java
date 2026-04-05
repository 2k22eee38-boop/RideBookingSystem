
package com.example.ride.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @GetMapping("/health")
    public String health(){
        return "Ride Booking API Running";
    }
}