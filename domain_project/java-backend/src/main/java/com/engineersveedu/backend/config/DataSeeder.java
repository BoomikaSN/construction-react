package com.engineersveedu.backend.config;

import com.engineersveedu.backend.model.CommunityPost;
import com.engineersveedu.backend.model.Contractor;
import com.engineersveedu.backend.model.User;
import com.engineersveedu.backend.model.Project;
import com.engineersveedu.backend.repository.CommunityPostRepository;
import com.engineersveedu.backend.repository.ContractorRepository;
import com.engineersveedu.backend.repository.UserRepository;
import com.engineersveedu.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContractorRepository contractorRepository;

    @Autowired
    private CommunityPostRepository postRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedContractors();
        seedProjects();
        seedCommunityPosts();
    }

    private void seedUsers() {
        userRepository.deleteAll();
        String defaultPassword = hashPassword("password");
        
        // Seed client user
        User client = new User("moni@gmail.com", defaultPassword, "client");
        client.setName("Moni");
        client.setPhone("+91 9999999999");
        client.setAddress("Chennai, Tamil Nadu");
        userRepository.save(client);

        // Seed builder user
        User builder = new User("boomikasn2006@gmail.com", defaultPassword, "builder");
        builder.setName("Boomika");
        builder.setPhone("+91 8888888888");
        builder.setAddress("Coimbatore, Tamil Nadu");
        builder.setContractorId(1L); // Link to Rajesh Kumar (Contractor ID 1)
        userRepository.save(builder);

        System.out.println("Purged user table and seeded target accounts: moni@gmail.com (client) and boomikasn2006@gmail.com (builder)");
    }

    private void seedContractors() {
        if (contractorRepository.count() == 0) {
            Contractor c1 = new Contractor(
                "Rajesh Kumar", 
                "Residential", 
                4.8, 
                "Chennai", 
                12, 
                true, 
                "Experienced structural engineer specializing in modern residential villas and multi-family units in Chennai region."
            );
            Contractor c2 = new Contractor(
                "Priya Sharma", 
                "Commercial", 
                4.5, 
                "Coimbatore", 
                8, 
                true, 
                "Commercial buildout expert with a track record of delivering retail and office spaces on time."
            );
            Contractor c3 = new Contractor(
                "Vikram Singh", 
                "Renovation", 
                4.9, 
                "Madurai", 
                15, 
                false, 
                "Specialist in restoring heritage properties and modernizing kitchens/exteriors with custom structural designs."
            );
            contractorRepository.save(c1);
            contractorRepository.save(c2);
            contractorRepository.save(c3);

            System.out.println("Seeded initial contractors data");
        }
    }

    private void seedCommunityPosts() {
        if (postRepository.count() == 0) {
            CommunityPost p1 = new CommunityPost(
                "John D.", 
                "Just completed our dream home with Engineers Veedu! Highly recommended.", 
                12, 
                2, 
                "2 days ago", 
                false
            );
            CommunityPost p2 = new CommunityPost(
                "Sarah M.", 
                "Anyone have recommendations for kitchen tile suppliers in Coimbatore?", 
                5, 
                8, 
                "5 days ago", 
                false
            );
            CommunityPost p3 = new CommunityPost(
                "Engineers Veedu Team", 
                "New blog post: 'Top 5 Sustainable Building Materials for 2026'. Check it out on our website!", 
                45, 
                0, 
                "1 week ago", 
                true
            );
            postRepository.save(p1);
            postRepository.save(p2);
            postRepository.save(p3);

            System.out.println("Seeded community posts feed");
        }
    }

    private void seedProjects() {
        projectRepository.deleteAll();
        
        Contractor c1 = contractorRepository.findById(1L).orElse(null);
        Contractor c2 = contractorRepository.findById(2L).orElse(null);
        
        if (c1 != null) {
            Project p1 = new Project(
                "Moni's Chennai Dream Villa",
                "Chennai",
                60,
                "Dec 2026",
                c1,
                "Residential",
                "Brick Work",
                "A beautiful modern villa with 4 bedrooms, custom modular kitchen, and private terrace gardens.",
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&q=80"
            );
            p1.setClientEmail("moni@gmail.com");
            projectRepository.save(p1);
        }
        
        if (c2 != null) {
            Project p2 = new Project(
                "Moni's Coimbatore Retail Shop",
                "Coimbatore",
                100,
                "June 2025",
                c2,
                "Commercial",
                "Completed",
                "Completed 2-story boutique fashion store with premium interior work.",
                "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=80"
            );
            p2.setClientEmail("moni@gmail.com");
            projectRepository.save(p2);
        }

        System.out.println("Purged and seeded projects assigned to moni@gmail.com");
    }

    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encodedhash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}
