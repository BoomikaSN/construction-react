package com.engineersveedu.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "contractors")
public class Contractor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String specialization; // e.g. Residential, Commercial, Renovation

    @Column(nullable = false)
    private Double rating; // e.g. 4.5

    @Column(nullable = false)
    private String city; // e.g. Chennai, Coimbatore, Madurai

    @Column(name = "contact_number")
    private String contactNumber;

    @Column(name = "years_experience", nullable = false)
    private Integer yearsExperience;

    @Column(nullable = false)
    private Boolean verified = false;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String bio;

    // Constructors
    public Contractor() {}

    public Contractor(String name, String specialization, Double rating, String city, Integer yearsExperience, Boolean verified, String bio) {
        this.name = name;
        this.specialization = specialization;
        this.rating = rating;
        this.city = city;
        this.yearsExperience = yearsExperience;
        this.verified = verified;
        this.bio = bio;
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

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public Integer getYearsExperience() {
        return yearsExperience;
    }

    public void setYearsExperience(Integer yearsExperience) {
        this.yearsExperience = yearsExperience;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }
}
