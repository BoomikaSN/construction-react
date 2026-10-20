package com.engineersveedu.backend.repository;

import com.engineersveedu.backend.model.Contractor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ContractorRepository extends JpaRepository<Contractor, Long> {
    
    List<Contractor> findByVerifiedTrue();
    
    @Query("SELECT c FROM Contractor c WHERE " +
           "(:query IS NULL OR :query = '' OR LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.specialization) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.city) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:city IS NULL OR :city = '' OR LOWER(c.city) = LOWER(:city)) AND " +
           "(:specialization IS NULL OR :specialization = '' OR c.specialization = :specialization) AND " +
           "(:minRating IS NULL OR c.rating >= :minRating) AND " +
           "(:minExperience IS NULL OR c.yearsExperience >= :minExperience)")
    List<Contractor> searchContractors(
        @Param("query") String query,
        @Param("city") String city,
        @Param("specialization") String specialization,
        @Param("minRating") Double minRating,
        @Param("minExperience") Integer minExperience
    );
}
