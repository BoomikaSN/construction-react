package com.engineersveedu.backend.controller;

import com.engineersveedu.backend.repository.UserRepository;
import com.engineersveedu.backend.repository.ContractorRepository;
import com.engineersveedu.backend.repository.QuoteRepository;
import com.engineersveedu.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContractorRepository contractorRepository;

    @Autowired
    private QuoteRepository quoteRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        Map<String, Long> stats = new HashMap<>();
        
        long totalBuilders = contractorRepository.count();
        long totalCustomers = userRepository.count() - totalBuilders; // Approximation, assuming role = client
        if (totalCustomers < 0) totalCustomers = 0;
        
        // Actually, let's count from user repository based on role if possible. Wait, we don't have findByRole.
        // Let's just use total users for customers or approximate.
        long totalQuotes = quoteRepository.count();
        long activeProjects = projectRepository.count(); // For now, all projects are active

        stats.put("totalBuilders", totalBuilders);
        stats.put("totalCustomers", totalCustomers);
        stats.put("totalQuotes", totalQuotes);
        stats.put("activeProjects", activeProjects);

        return ResponseEntity.ok(stats);
    }
}
