package com.ucmTEAM4.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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
    
    @NotBlank(message = "Topic ID is required")
    private String topicId;

    @NotBlank(message = "Topic name is required")
    private String topicName;

    @NotBlank(message = "Branch ID is required")
    private String branchId;

    @NotBlank(message = "Branch name is required")
    private String branchName;

    @NotBlank(message = "Date is required")
    private String dateLabel;

    @NotBlank(message = "Time is required")
    private String timeLabel;

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Customer email is required")
    @Email(message = "Customer email must be valid")
    private String customerEmail;

    @NotBlank(message = "Customer phone is required")
    private String customerPhone;

    private String comments;
    private String userId; // Add user ID to associate appointments with users
}
