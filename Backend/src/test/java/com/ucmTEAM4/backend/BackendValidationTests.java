package com.ucmTEAM4.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ucmTEAM4.backend.entity.Appointment;
import com.ucmTEAM4.backend.entity.User;
import com.ucmTEAM4.backend.repository.AppointmentRepository;
import com.ucmTEAM4.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class BackendValidationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void registerWithoutUsernameShouldReturnBadRequest() throws Exception {
        User user = new User();
        user.setPassword("password123");
        user.setEmail("missing@example.com");
        user.setFirstName("Missing");
        user.setLastName("Username");
        user.setPhone("123-456-7890");

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.username").value("Username is required"));
    }

    @Test
    void registerDuplicateUsernameShouldReturnBadRequest() throws Exception {
        User existing = new User();
        existing.setUsername("duplicateUser");
        existing.setPassword("password123");
        existing.setEmail("duplicate@example.com");
        existing.setFirstName("Duplicate");
        existing.setLastName("User");
        existing.setPhone("123-456-7890");
        userRepository.save(existing);

        User user = new User();
        user.setUsername("duplicateUser");
        user.setPassword("password123");
        user.setEmail("other@example.com");
        user.setFirstName("Duplicate");
        user.setLastName("User");
        user.setPhone("123-456-7890");

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("Username already exists"));
    }

    @Test
    void createAppointmentMissingRequiredFieldShouldReturnBadRequest() throws Exception {
        Appointment appointment = new Appointment();
        appointment.setTopicId("t1");
        appointment.setTopicName("Checking & Savings");
        appointment.setBranchId("b1");
        appointment.setBranchName("Plaza Branch");
        appointment.setTimeLabel("2:00 PM");
        appointment.setCustomerName("Test User");
        appointment.setCustomerEmail("test@example.com");
        appointment.setCustomerPhone("555-555-5555");
        appointment.setComments("Missing dateLabel field");
        appointment.setUserId("testUser");

        mockMvc.perform(post("/api/appointments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(appointment)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.dateLabel").value("Date is required"));
    }

    @Test
    void createDuplicateAppointmentSlotShouldReturnConflict() throws Exception {
        Appointment first = new Appointment();
        first.setTopicId("t2");
        first.setTopicName("Credit Cards");
        first.setBranchId("b2");
        first.setBranchName("South State Line Branch");
        first.setDateLabel("May 05");
        first.setTimeLabel("10:00 AM");
        first.setCustomerName("First User");
        first.setCustomerEmail("first@example.com");
        first.setCustomerPhone("555-000-0000");
        first.setComments("First appointment");
        first.setUserId("firstUser");
        appointmentRepository.save(first);

        Appointment duplicate = new Appointment();
        duplicate.setTopicId("t2");
        duplicate.setTopicName("Credit Cards");
        duplicate.setBranchId("b2");
        duplicate.setBranchName("South State Line Branch");
        duplicate.setDateLabel("May 05");
        duplicate.setTimeLabel("10:00 AM");
        duplicate.setCustomerName("Second User");
        duplicate.setCustomerEmail("second@example.com");
        duplicate.setCustomerPhone("555-111-1111");
        duplicate.setComments("Duplicate slot test");
        duplicate.setUserId("secondUser");

        mockMvc.perform(post("/api/appointments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(duplicate)))
            .andExpect(status().isConflict())
            .andExpect(result -> {
                String content = result.getResponse().getContentAsString();
                if (!content.contains("The selected time slot is already booked.")) {
                    throw new AssertionError("Expected conflict message, but got: " + content);
                }
            });
    }
}
