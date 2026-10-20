package com.engineersveedu.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "saved_contractors")
public class SavedContractor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "contractor_id", nullable = false)
    private Long contractorId;

    public SavedContractor() {}

    public SavedContractor(String userEmail, Long contractorId) {
        this.userEmail = userEmail;
        this.contractorId = contractorId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    
    public Long getContractorId() { return contractorId; }
    public void setContractorId(Long contractorId) { this.contractorId = contractorId; }
}
