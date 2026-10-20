package com.engineersveedu.backend.repository;

import com.engineersveedu.backend.model.SavedContractor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavedContractorRepository extends JpaRepository<SavedContractor, Long> {
    boolean existsByUserEmailAndContractorId(String userEmail, Long contractorId);
    void deleteByUserEmailAndContractorId(String userEmail, Long contractorId);
    List<SavedContractor> findByUserEmail(String userEmail);
}
