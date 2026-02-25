package com.consentapp.repository;

import com.consentapp.entity.ConsentTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsentTemplateRepository extends JpaRepository<ConsentTemplate, Long> {
    List<ConsentTemplate> findByIsActiveTrue();
}
