package com.engineersveedu.backend.controller;

import com.engineersveedu.backend.model.Contractor;
import com.engineersveedu.backend.repository.ContractorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.engineersveedu.backend.model.Project;
import com.engineersveedu.backend.repository.ProjectRepository;
import com.engineersveedu.backend.model.Review;
import com.engineersveedu.backend.repository.ReviewRepository;
import com.engineersveedu.backend.model.SavedContractor;
import com.engineersveedu.backend.repository.SavedContractorRepository;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/contractors")
@CrossOrigin(origins = "*")
public class ContractorController {

    @Autowired
    private ContractorRepository contractorRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private SavedContractorRepository savedContractorRepository;

    @GetMapping
    public ResponseEntity<List<Contractor>> searchContractors(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String specialization,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Integer minExperience) {
        
        List<Contractor> contractors = contractorRepository.searchContractors(query, city, specialization, minRating, minExperience);
        return ResponseEntity.ok(contractors);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Contractor>> getFeaturedContractors() {
        List<Contractor> featured = contractorRepository.findByVerifiedTrue();
        // If no verified found, return first few
        if (featured.isEmpty()) {
            featured = contractorRepository.findAll().subList(0, Math.min(3, (int) contractorRepository.count()));
        }
        return ResponseEntity.ok(featured);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getContractorById(@PathVariable Long id) {
        Optional<Contractor> contractorOpt = contractorRepository.findById(id);
        if (contractorOpt.isPresent()) {
            return ResponseEntity.ok(contractorOpt.get());
        }

        Map<String, String> error = new HashMap<>();
        error.put("error", "Contractor not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @GetMapping("/{id}/projects")
    public ResponseEntity<List<Project>> getContractorProjects(@PathVariable Long id) {
        return ResponseEntity.ok(projectRepository.findByContractorId(id));
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<Review>> getContractorReviews(@PathVariable Long id) {
        return ResponseEntity.ok(reviewRepository.findByContractorIdOrderByCreatedAtDesc(id));
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<?> addContractorReview(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Optional<Contractor> contractorOpt = contractorRepository.findById(id);
        if (!contractorOpt.isPresent()) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Contractor not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
        }
        
        Contractor contractor = contractorOpt.get();
        String author = (String) body.getOrDefault("author", "Anonymous");
        Integer rating = (Integer) body.getOrDefault("rating", 5);
        String text = (String) body.getOrDefault("text", "");
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM yyyy"));

        Review review = new Review(author, rating, text, date, contractor);
        reviewRepository.save(review);
        
        Map<String, Object> res = new HashMap<>();
        res.put("message", "Review added successfully");
        res.put("review", review);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<?> saveContractor(@PathVariable Long id, @RequestParam String email) {
        if (!contractorRepository.existsById(id)) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Contractor not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
        }
        if (!savedContractorRepository.existsByUserEmailAndContractorId(email, id)) {
            savedContractorRepository.save(new SavedContractor(email, id));
        }
        Map<String, String> res = new HashMap<>();
        res.put("message", "Contractor saved successfully");
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/{id}/save")
    @Transactional
    public ResponseEntity<?> unsaveContractor(@PathVariable Long id, @RequestParam String email) {
        savedContractorRepository.deleteByUserEmailAndContractorId(email, id);
        Map<String, String> res = new HashMap<>();
        res.put("message", "Contractor removed from saved list");
        return ResponseEntity.ok(res);
    }
}
