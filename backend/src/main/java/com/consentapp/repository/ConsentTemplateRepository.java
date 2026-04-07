package com.consentapp.repository;

import com.consentapp.entity.ConsentTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsentTemplateRepository extends JpaRepository<ConsentTemplate, Long> {
    List<ConsentTemplate> findByIsActiveTrue();
    Page<ConsentTemplate> findByIsActiveTrue(Pageable pageable);
    Page<ConsentTemplate> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    Page<ConsentTemplate> findByIsActiveTrueAndTitleContainingIgnoreCase(String title, Pageable pageable);
    List<ConsentTemplate> findByTitleOrderByVersionDesc(String title);
}
