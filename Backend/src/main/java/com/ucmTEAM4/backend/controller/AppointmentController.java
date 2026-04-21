package com.ucmTEAM4.backend.controller;

import com.ucmTEAM4.backend.entity.Appointment;
import com.ucmTEAM4.backend.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody Appointment appointment) {
        try {
            // Check for existing appointment at the same time
            List<Appointment> existing = appointmentRepository.findByBranchIdAndDateLabelAndTimeLabel(
                appointment.getBranchId(), appointment.getDateLabel(), appointment.getTimeLabel());
            if (!existing.isEmpty()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("The selected time slot is already booked.");
            }

            // Set userId if not provided (for backward compatibility)
            if (appointment.getUserId() == null || appointment.getUserId().isEmpty()) {
                appointment.setUserId("guest"); // Default for unauthenticated users
            }
            Appointment savedAppointment = appointmentRepository.save(appointment);
            return ResponseEntity.ok(savedAppointment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/booked-times")
    public ResponseEntity<List<String>> getBookedTimes(@RequestParam String branchId, @RequestParam String dateLabel) {
        List<Appointment> appointments = appointmentRepository.findByBranchIdAndDateLabel(branchId, dateLabel);
        List<String> bookedTimes = appointments.stream().map(Appointment::getTimeLabel).collect(Collectors.toList());
        return ResponseEntity.ok(bookedTimes);
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments(@RequestParam(required = false) String userId) {
        List<Appointment> appointments;
        if (userId != null && !userId.isEmpty()) {
            appointments = appointmentRepository.findByUserId(userId);
        } else {
            appointments = appointmentRepository.findAll();
        }
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        return appointment.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id, @RequestParam String userId) {
        try {
            Optional<Appointment> appointment = appointmentRepository.findById(id);
            if (appointment.isPresent()) {
                // Check if the user owns this appointment
                if (appointment.get().getUserId().equals(userId)) {
                    appointmentRepository.deleteById(id);
                    return ResponseEntity.ok().build();
                } else {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // User doesn't own this appointment
                }
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}