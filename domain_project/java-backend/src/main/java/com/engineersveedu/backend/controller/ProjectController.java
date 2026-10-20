package com.engineersveedu.backend.controller;

import com.engineersveedu.backend.model.Project;
import com.engineersveedu.backend.model.Contractor;
import com.engineersveedu.backend.repository.ProjectRepository;
import com.engineersveedu.backend.repository.ContractorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping
@CrossOrigin(origins = "*")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ContractorRepository contractorRepository;

    @GetMapping("/projects")
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectRepository.findAll());
    }

    @GetMapping("/projects/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable Long id) {
        Optional<Project> projectOpt = projectRepository.findById(id);
        if (projectOpt.isPresent()) {
            return ResponseEntity.ok(projectOpt.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Project not found"));
    }
    @GetMapping("/projects/client")
    public ResponseEntity<List<Project>> getProjectsByClient(@RequestParam String email) {
        return ResponseEntity.ok(projectRepository.findByClientEmail(email));
    }

    @GetMapping("/projects/contractor/{contractorId}")
    public ResponseEntity<List<Project>> getProjectsByContractor(@PathVariable Long contractorId) {
        return ResponseEntity.ok(projectRepository.findByContractorId(contractorId));
    }

    @PostMapping("/projects")
    public ResponseEntity<?> createProject(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        String location = (String) request.get("location");
        Integer progress = (Integer) request.getOrDefault("progress", 0);
        String deadline = (String) request.get("deadline");
        String category = (String) request.get("category");
        String status = (String) request.getOrDefault("status", "Planning");
        String description = (String) request.get("description");
        String image = (String) request.get("image");
        String clientEmail = (String) request.get("clientEmail");

        Object contractorIdObj = request.get("contractorId");
        Optional<Contractor> contractorOpt = Optional.empty();
        if (contractorIdObj != null) {
            try {
                Long contractorId = Long.valueOf(contractorIdObj.toString());
                contractorOpt = contractorRepository.findById(contractorId);
            } catch (Exception e) {}
        }
        
        if (!contractorOpt.isPresent()) {
            List<Contractor> allContractors = contractorRepository.findAll();
            if (allContractors.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "No contractors found in database"));
            }
            contractorOpt = Optional.of(allContractors.get(0));
        }

        Project project = new Project(name, location, progress, deadline, contractorOpt.get(), category, status, description, image);
        project.setClientEmail(clientEmail);
        projectRepository.save(project);
        return ResponseEntity.status(HttpStatus.CREATED).body(project);
    }

    @PutMapping("/projects/{id}/progress")
    public ResponseEntity<?> updateProjectProgress(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Optional<Project> projectOpt = projectRepository.findById(id);
        if (projectOpt.isPresent()) {
            Project project = projectOpt.get();
            if (request.containsKey("progress")) {
                project.setProgress((Integer) request.get("progress"));
            }
            if (request.containsKey("status")) {
                project.setStatus((String) request.get("status"));
            }
            projectRepository.save(project);
            return ResponseEntity.ok(project);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Project not found"));
    }
}
