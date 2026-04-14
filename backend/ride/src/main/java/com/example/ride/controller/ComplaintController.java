package com.example.ride.controller;

import com.example.ride.entity.Complaint;
import com.example.ride.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    public Complaint submitComplaint(@RequestBody Complaint complaint) {
        return complaintService.submitComplaint(complaint);
    }

    @GetMapping
    public List<Complaint> getAllComplaints() {
        return complaintService.getAllComplaints();
    }

    @PutMapping("/{id}/status")
    public Complaint updateComplaintStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return complaintService.updateComplaintStatus(id, body.get("status"));
    }
}
