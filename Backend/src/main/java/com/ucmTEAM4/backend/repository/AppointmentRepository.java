package com.ucmTEAM4.backend.repository;

import com.ucmTEAM4.backend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUserId(String userId);
    List<Appointment> findByBranchIdAndDateLabel(String branchId, String dateLabel);
    List<Appointment> findByBranchIdAndDateLabelAndTimeLabel(String branchId, String dateLabel, String timeLabel);
}
