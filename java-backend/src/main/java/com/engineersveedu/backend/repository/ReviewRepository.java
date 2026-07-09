package com.engineersveedu.backend.repository;

import com.engineersveedu.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByContractorIdOrderByCreatedAtDesc(Long contractorId);
    List<Review> findTop5ByOrderByCreatedAtDesc();
}
