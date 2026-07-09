package com.engineersveedu.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quotes")
public class Quote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "project_type", nullable = false)
    private String projectType = "General"; // Residential, Commercial, Renovation, General

    @Column
    private String budget;

    @Column(name = "expected_date")
    private String expectedDate;

    @Column(nullable = false)
    private String status = "New Inquiry"; // New Inquiry, Quote Sent, Site Visit Scheduled

    @Column(name = "contractor_id")
    private Long contractorId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Constructors
    public Quote() {}

    public Quote(String name, String email, String message, String projectType, String status) {
        this.name = name;
        this.email = email;
        this.message = message;
        this.projectType = projectType;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getProjectType() {
        return projectType;
    }

    public void setProjectType(String projectType) {
        this.projectType = projectType;
    }

    public String getBudget() {
        return budget;
    }

    public void setBudget(String budget) {
        this.budget = budget;
    }

    public String getExpectedDate() {
        return expectedDate;
    }

    public void setExpectedDate(String expectedDate) {
        this.expectedDate = expectedDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getContractorId() {
        return contractorId;
    }

    public void setContractorId(Long contractorId) {
        this.contractorId = contractorId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
