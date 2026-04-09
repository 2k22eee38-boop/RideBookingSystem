package com.example.ride.service;

import com.example.ride.entity.Complaint;
import com.example.ride.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;

    public Complaint submitComplaint(Complaint complaint) {
        complaint.setSubmittedAt(LocalDateTime.now());
        complaint.setStatus("PENDING");
        return complaintRepository.save(complaint);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }
}
