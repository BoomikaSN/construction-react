package com.engineersveedu.backend.controller;

import com.engineersveedu.backend.util.JwtUtil;

import com.engineersveedu.backend.model.Quote;
import com.engineersveedu.backend.repository.QuoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/quotes")
@CrossOrigin(origins = "*")
public class QuoteController {

    @Autowired
    private QuoteRepository quoteRepository;

    @PostMapping
    public ResponseEntity<?> submitQuote(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String message = request.get("message");
        String projectType = request.getOrDefault("projectType", "General");

        String budget = request.get("budget");
        String expectedDate = request.get("expectedDate");
        String contractorIdStr = request.get("contractorId");

        if (name == null || email == null || message == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Name, email, and message are required fields");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        Quote quote = new Quote(name, email, message, projectType, "New Inquiry");
        if (budget != null) quote.setBudget(budget);
        if (expectedDate != null) quote.setExpectedDate(expectedDate);
        if (contractorIdStr != null) {
            try {
                quote.setContractorId(Long.parseLong(contractorIdStr.toString()));
            } catch (Exception e) {}
        }
        
        quoteRepository.save(quote);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Quote request submitted successfully");
        response.put("quoteId", quote.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<Quote>> getAllQuotes(@RequestParam(required = false) String email) {
        if (email != null && !email.isEmpty()) {
            return ResponseEntity.ok(quoteRepository.findByEmail(email));
        }
        return ResponseEntity.ok(quoteRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/client")
    public ResponseEntity<?> getClientQuotes(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !JwtUtil.validateToken(authHeader)) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Unauthorized");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        }
        String email = JwtUtil.getEmailFromToken(authHeader);
        return ResponseEntity.ok(quoteRepository.findByEmail(email));
    }

    @GetMapping("/contractor")
    public ResponseEntity<?> getContractorQuotes(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !JwtUtil.validateToken(authHeader)) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Unauthorized");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        }
        // Ideally filter by contractor's ID/email. Since quote right now is generic, we just return all quotes for now.
        return ResponseEntity.ok(quoteRepository.findAllByOrderByCreatedAtDesc());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateQuoteStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String status = request.get("status");
        if (status == null) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Status is required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        }
        Optional<Quote> quoteOpt = quoteRepository.findById(id);
        if (quoteOpt.isPresent()) {
            Quote quote = quoteOpt.get();
            quote.setStatus(status);
            quoteRepository.save(quote);
            Map<String, String> res = new HashMap<>();
            res.put("message", "Status updated successfully");
            res.put("status", status);
            return ResponseEntity.ok(res);
        }
        Map<String, String> notFoundErr = new HashMap<>();
        notFoundErr.put("error", "Quote not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(notFoundErr);
    }
}
