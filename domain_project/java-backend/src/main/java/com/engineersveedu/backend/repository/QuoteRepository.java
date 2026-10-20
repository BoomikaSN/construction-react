package com.engineersveedu.backend.repository;

import com.engineersveedu.backend.model.Quote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuoteRepository extends JpaRepository<Quote, Long> {
    List<Quote> findByEmail(String email);
    List<Quote> findAllByOrderByCreatedAtDesc();
}
