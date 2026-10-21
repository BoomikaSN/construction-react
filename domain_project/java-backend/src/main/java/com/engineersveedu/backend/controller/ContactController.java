package com.engineersveedu.backend.controller;

import com.engineersveedu.backend.model.Quote;
import com.engineersveedu.backend.repository.QuoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    @Autowired
    private QuoteRepository quoteRepository;

    @PostMapping
    public ResponseEntity<?> handleContact(@RequestBody Map<String, String> request) {
        String name = request.getOrDefault("name", "Website Visitor");
        String email = request.getOrDefault("email", "");
        String phone = request.getOrDefault("phone", "");
        String projectType = request.getOrDefault("projectType", "Contact Inquiry");
        String message = request.getOrDefault("message", "");

        if (email.isEmpty() && phone.isEmpty()) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Email or phone is required");
            return ResponseEntity.badRequest().body(err);
        }

        Quote inquiry = new Quote(name, email, message + (phone.isEmpty() ? "" : " | Phone: " + phone), projectType, "Contact Inquiry");
        quoteRepository.save(inquiry);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Contact inquiry received successfully");
        res.put("id", inquiry.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }
}
