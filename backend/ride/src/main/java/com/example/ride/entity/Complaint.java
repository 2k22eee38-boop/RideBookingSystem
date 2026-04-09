package com.example.ride.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "complaints")
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long submitterId;
    private String submitterRole;
    private String message;
    private String status = "PENDING";
    private LocalDateTime submittedAt = LocalDateTime.now();
}
