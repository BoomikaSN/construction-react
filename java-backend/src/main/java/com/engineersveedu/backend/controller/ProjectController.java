package com.engineersveedu.backend.controller;

import com.engineersveedu.backend.model.Project;
import com.engineersveedu.backend.repository.ProjectRepository;
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

    @GetMapping("/contractors/{contractorId}/projects")
    public ResponseEntity<List<Project>> getProjectsByContractor(@PathVariable Long contractorId) {
        return ResponseEntity.ok(projectRepository.findByContractorId(contractorId));
    }

    @PostMapping("/projects")
    public ResponseEntity<?> createProject(@RequestBody Project project) {
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
