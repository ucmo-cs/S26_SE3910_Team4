package com.ucmTEAM4.backend.controller;

import com.ucmTEAM4.backend.entity.User;
import com.ucmTEAM4.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            // Check if username already exists
            if (userRepository.existsByUsername(user.getUsername())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Username already exists");
                return ResponseEntity.badRequest().body(error);
            }

            // Check if email already exists
            if (userRepository.existsByEmail(user.getEmail())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Email already exists");
                return ResponseEntity.badRequest().body(error);
            }

            // Save the user
            User savedUser = userRepository.save(user);

            // Return user data without password
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedUser.getId());
            response.put("username", savedUser.getUsername());
            response.put("email", savedUser.getEmail());
            response.put("firstName", savedUser.getFirstName());
            response.put("lastName", savedUser.getLastName());
            response.put("phone", savedUser.getPhone());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Registration failed");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String username = credentials.get("username");
            String password = credentials.get("password");

            Optional<User> user = userRepository.findByUsername(username);
            if (user.isPresent() && user.get().getPassword().equals(password)) {
                // Return user data without password
                Map<String, Object> response = new HashMap<>();
                response.put("id", user.get().getId());
                response.put("username", user.get().getUsername());
                response.put("email", user.get().getEmail());
                response.put("firstName", user.get().getFirstName());
                response.put("lastName", user.get().getLastName());
                response.put("phone", user.get().getPhone());

                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid username or password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Login failed");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestParam String username) {
        try {
            Optional<User> user = userRepository.findByUsername(username);
            if (user.isPresent()) {
                // Return user data without password
                Map<String, Object> response = new HashMap<>();
                response.put("id", user.get().getId());
                response.put("username", user.get().getUsername());
                response.put("email", user.get().getEmail());
                response.put("firstName", user.get().getFirstName());
                response.put("lastName", user.get().getLastName());
                response.put("phone", user.get().getPhone());

                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "User not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to get profile");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestParam String username, @RequestBody User updatedUser) {
        try {
            Optional<User> existingUser = userRepository.findByUsername(username);
            if (existingUser.isPresent()) {
                User user = existingUser.get();

                // Update fields (but not username or id)
                if (updatedUser.getEmail() != null) {
                    // Check if email is already taken by another user
                    Optional<User> emailUser = userRepository.findByEmail(updatedUser.getEmail());
                    if (emailUser.isPresent() && !emailUser.get().getId().equals(user.getId())) {
                        Map<String, String> error = new HashMap<>();
                        error.put("error", "Email already exists");
                        return ResponseEntity.badRequest().body(error);
                    }
                    user.setEmail(updatedUser.getEmail());
                }
                if (updatedUser.getFirstName() != null) user.setFirstName(updatedUser.getFirstName());
                if (updatedUser.getLastName() != null) user.setLastName(updatedUser.getLastName());
                if (updatedUser.getPhone() != null) user.setPhone(updatedUser.getPhone());
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    user.setPassword(updatedUser.getPassword());
                }

                User savedUser = userRepository.save(user);

                // Return user data without password
                Map<String, Object> response = new HashMap<>();
                response.put("id", savedUser.getId());
                response.put("username", savedUser.getUsername());
                response.put("email", savedUser.getEmail());
                response.put("firstName", savedUser.getFirstName());
                response.put("lastName", savedUser.getLastName());
                response.put("phone", savedUser.getPhone());

                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "User not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update profile");
            return ResponseEntity.badRequest().body(error);
        }
    }
}