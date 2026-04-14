package com.ucmTEAM4.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String topicId;
    private String topicName;
    private String branchId;
    private String branchName;
    private String dateLabel;
    private String timeLabel;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String comments;
}
