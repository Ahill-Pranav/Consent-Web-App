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

    private final ConsentRecordRepository consentRecordRepository;
    private final ConsentTemplateRepository templateRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    @SuppressWarnings("null")
    public ConsentResponse signConsent(Long templateId, String userEmail, String ipAddress, String userAgent) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ConsentTemplate template = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found"));

        // Verify that the template is assigned to the user
        if (!template.getAssignedStudents().contains(user)) {
            throw new ValidationException("You are not assigned to this consent form.");
        }

        String auditLog = generateAuditLog(user, template, "SIGN", userAgent);
        String signatureHash = generateSignatureHash(user, template, auditLog);

        ConsentRecord record = ConsentRecord.builder()
                .template(template)
                .user(user)
                .signedAt(LocalDateTime.now())
                .ipAddress(ipAddress)
                .status(ConsentStatus.SIGNED)
                .signatureHash(signatureHash)
                .auditLog(auditLog)
                .build();

        consentRecordRepository.save(record);
        return mapToResponse(record);
    }

    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public List<ConsentResponse> getMyConsents(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return consentRecordRepository.findByUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ConsentResponse> getAllConsents() {
        return consentRecordRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private String generateSignatureHash(User user, ConsentTemplate template, String auditLog) {
        try {
            String data = user.getEmail() + template.getId() + template.getVersion() + auditLog + LocalDateTime.now();
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data.getBytes());
            return bytesToHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error generating signature hash", e);
        }
    }

    private String generateAuditLog(User user, ConsentTemplate template, String action, String userAgent) {
        try {
            Map<String, Object> auditData = new HashMap<>();
            auditData.put("timestamp", LocalDateTime.now().toString());
            auditData.put("userId", user.getId());
            auditData.put("userEmail", user.getEmail());
            auditData.put("templateId", template.getId());
            auditData.put("templateVersion", template.getVersion());
            auditData.put("action", action);
            auditData.put("userAgent", userAgent);
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
        ConsentResponse response = new ConsentResponse();
        response.setId(record.getId());
        response.setTemplateId(record.getTemplate().getId());
        response.setUserId(record.getUser().getId());
        response.setSignedAt(record.getSignedAt());
        response.setIpAddress(record.getIpAddress());
        response.setStatus(record.getStatus());
        response.setSignatureHash(record.getSignatureHash());
        response.setAuditLog(record.getAuditLog());
        return response;
    }
}
