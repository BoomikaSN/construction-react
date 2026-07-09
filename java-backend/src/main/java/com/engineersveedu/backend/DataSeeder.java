package com.engineersveedu.backend;

import com.engineersveedu.backend.model.Contractor;
import com.engineersveedu.backend.model.Project;
import com.engineersveedu.backend.model.Review;
import com.engineersveedu.backend.repository.ContractorRepository;
import com.engineersveedu.backend.repository.ProjectRepository;
import com.engineersveedu.backend.repository.ReviewRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Arrays;

@Configuration("projectDataSeederBean")
public class DataSeeder {

    @Bean
    CommandLineRunner initData(ContractorRepository contractorRepository, 
                               ProjectRepository projectRepository, 
                               ReviewRepository reviewRepository) {
        return args -> {
            if (projectRepository.count() == 0) {
                Contractor c1 = new Contractor("BuildPro Const.", "Residential, Commercial", 4.8, "Chennai", 10, true, "Expert in modern residential construction. Call: +91 9876543210");
                Contractor c2 = new Contractor("Elite Structures", "Renovations, Interior", 4.5, "Coimbatore", 5, true, "Specializes in high quality interiors. Call: +91 8765432109");
                contractorRepository.saveAll(Arrays.asList(c1, c2));

                Project p1 = new Project("Modern Villa", "Chennai", 70, "Dec 2024", c1, "Residential", "Painting", "A beautiful modern villa with 4 bedrooms.", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&q=80");
                Project p2 = new Project("Office Complex", "Chennai", 40, "Mar 2025", c1, "Commercial", "Brick Work", "A 5-story office building.", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=80");
                Project p3 = new Project("Kitchen Renovation", "Coimbatore", 90, "Aug 2024", c2, "Renovation", "Completed", "Complete kitchen overhaul.", "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&q=80");
                projectRepository.saveAll(Arrays.asList(p1, p2, p3));

                Review r1 = new Review("John Doe", 5, "Excellent work, highly recommended!", "Jan 2024", c1);
                Review r2 = new Review("Jane Smith", 4, "Good quality but slightly delayed.", "Feb 2024", c1);
                Review r3 = new Review("Mike Johnson", 5, "Very professional team.", "Mar 2024", c2);
                reviewRepository.saveAll(Arrays.asList(r1, r2, r3));
            }
        };
    }
}
