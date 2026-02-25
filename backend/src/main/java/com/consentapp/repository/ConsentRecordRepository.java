package com.consentapp.repository;

import com.consentapp.entity.ConsentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConsentRecordRepository extends JpaRepository<ConsentRecord, Long> {
    List<ConsentRecord> findByUserId(Long userId);
    List<ConsentRecord> findByTemplateId(Long templateId);
    Optional<ConsentRecord> findByUserIdAndTemplateId(Long userId, Long templateId);
    boolean existsByUserIdAndTemplateId(Long userId, Long templateId);
}
