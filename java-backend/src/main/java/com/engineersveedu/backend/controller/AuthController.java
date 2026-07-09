package com.engineersveedu.backend.controller;

import com.engineersveedu.backend.model.User;
import com.engineersveedu.backend.repository.UserRepository;
import com.engineersveedu.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String role = request.getOrDefault("role", "client");

        if (email == null || password == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Email and password are required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        if (userRepository.existsByEmail(email)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Email already exists");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        }

        String hashedPassword = hashPassword(password);
        User user = new User(email, hashedPassword, role);
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully");
        response.put("role", role);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String requestedRole = request.get("role");

        if (email == null || password == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Email and password are required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(hashPassword(password))) {

                // If user requested a different role, update it
                if (requestedRole != null && !requestedRole.equals(user.getRole())) {
                    user.setRole(requestedRole);
                    userRepository.save(user);
                }

                String token = JwtUtil.generateToken(user.getEmail(), user.getRole());

                Map<String, Object> response = new HashMap<>();
                response.put("message", "Login successful");

                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", user.getId());
                userMap.put("email", user.getEmail());
                userMap.put("role", user.getRole());

                response.put("user", userMap);
                response.put("token", token);
                return ResponseEntity.ok(response);
            }
        }

        Map<String, String> error = new HashMap<>();
        error.put("error", "Invalid email or password");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !JwtUtil.validateToken(authHeader)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Unauthorized - Missing or invalid token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        String email = JwtUtil.getEmailFromToken(authHeader);
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());
            response.put("username", user.getEmail().split("@")[0]);
            response.put("name", user.getName());
            response.put("phone", user.getPhone());
            response.put("address", user.getAddress());
            response.put("profilePhotoUrl", user.getProfilePhotoUrl());
            return ResponseEntity.ok(response);
        }

        Map<String, String> error = new HashMap<>();
        error.put("error", "User not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestHeader(value = "Authorization", required = false) String authHeader, @RequestBody Map<String, String> request) {
        if (authHeader == null || !JwtUtil.validateToken(authHeader)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Unauthorized - Missing or invalid token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        String email = JwtUtil.getEmailFromToken(authHeader);
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (request.containsKey("name")) user.setName(request.get("name"));
            if (request.containsKey("phone")) user.setPhone(request.get("phone"));
            if (request.containsKey("address")) user.setAddress(request.get("address"));
            if (request.containsKey("profilePhotoUrl")) user.setProfilePhotoUrl(request.get("profilePhotoUrl"));
            
            userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile updated successfully");
            return ResponseEntity.ok(response);
        }

        Map<String, String> error = new HashMap<>();
        error.put("error", "User not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encodedhash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not found", e);
        }
    }
}
