package com.engineersveedu.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column
    private String location;

    @Column
    private Integer progress = 0; // percentage

    @Column
    private String deadline;

    @ManyToOne
    @JoinColumn(name = "contractor_id", nullable = false)
    private Contractor contractor;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private String image;

    @Column
    private String category;

    @Column
    private String status = "Planning"; // Planning, Foundation, Brick Work, Painting, Completed

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Project() {}

    public Project(String name, String location, Integer progress, String deadline, Contractor contractor, String category, String status, String description, String image) {
        this.name = name;
        this.location = location;
        this.progress = progress;
        this.deadline = deadline;
        this.contractor = contractor;
        this.category = category;
        this.status = status;
        this.description = description;
        this.image = image;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }
    
    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }
    
    public Contractor getContractor() { return contractor; }
    public void setContractor(Contractor contractor) { this.contractor = contractor; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
