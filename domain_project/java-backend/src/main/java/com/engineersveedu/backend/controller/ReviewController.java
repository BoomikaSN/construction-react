package com.engineersveedu.backend.controller;

import com.engineersveedu.backend.model.Review;
import com.engineersveedu.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping("/recent")
    public ResponseEntity<List<Review>> getRecentReviews() {
        return ResponseEntity.ok(reviewRepository.findTop5ByOrderByCreatedAtDesc());
    }
}
