package com.consentapp.service;

import com.consentapp.dto.ConsentResponse;
import com.consentapp.entity.ConsentRecord;
import com.consentapp.entity.ConsentStatus;
import com.consentapp.entity.ConsentTemplate;
import com.consentapp.entity.User;
import com.consentapp.exception.ResourceNotFoundException;
import com.consentapp.exception.ValidationException;
import com.consentapp.repository.ConsentRecordRepository;
import com.consentapp.repository.ConsentTemplateRepository;
import com.consentapp.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsentService {

    private final ConsentRecordRepository consentRepository;
    private final ConsentTemplateRepository templateRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public ConsentResponse signConsent(Long templateId, String userEmail, String ipAddress, String userAgent) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ConsentTemplate template = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + templateId));

        if (!template.getIsActive()) {
            throw new ValidationException("Cannot sign an inactive template.");
        }

        if (consentRepository.existsByUserIdAndTemplateId(user.getId(), template.getId())) {
            throw new ValidationException("User has already signed this template.");
        }

        LocalDateTime now = LocalDateTime.now();
        String signatureHash = generateSignatureHash(user.getId(), template.getId(), now.toString());
        String auditLog = generateAuditLog(userAgent, ipAddress, now.toString(), "SIGNED");

        ConsentRecord record = ConsentRecord.builder()
                .template(template)
                .user(user)
                .signedAt(now)
                .ipAddress(ipAddress)
                .status(ConsentStatus.SIGNED)
                .signatureHash(signatureHash)
                .auditLog(auditLog)
                .build();

        consentRepository.save(record);
        return mapToResponse(record);
    }

    @Transactional(readOnly = true)
    public List<ConsentResponse> getMyConsents(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return consentRepository.findByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ConsentResponse> getAllConsents() {
        return consentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private String generateSignatureHash(Long userId, Long templateId, String timestamp) {
        try {
            String input = userId + "-" + templateId + "-" + timestamp;
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(encodedhash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error generating signature hash", e);
        }
    }

    private String generateAuditLog(String userAgent, String ipAddress, String timestamp, String action) {
        try {
            Map<String, String> auditData = new HashMap<>();
            auditData.put("userAgent", userAgent != null ? userAgent : "Unknown");
            auditData.put("ip", ipAddress != null ? ipAddress : "Unknown");
            auditData.put("timestamp", timestamp);
            auditData.put("action", action);
            return objectMapper.writeValueAsString(auditData);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error generating JSON audit log", e);
        }
    }

    private String bytesToHex(byte[] hash) {
        StringBuilder hexString = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

    private ConsentResponse mapToResponse(ConsentRecord record) {
        return ConsentResponse.builder()
                .id(record.getId())
                .templateId(record.getTemplate().getId())
                .userId(record.getUser().getId())
                .signedAt(record.getSignedAt())
                .ipAddress(record.getIpAddress())
                .status(record.getStatus())
                .signatureHash(record.getSignatureHash())
                .auditLog(record.getAuditLog())
                .build();
    }
}
