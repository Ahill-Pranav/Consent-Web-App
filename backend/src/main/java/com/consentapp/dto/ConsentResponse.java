package com.consentapp.dto;

import com.consentapp.entity.ConsentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ConsentResponse {

    private Long id;
    private Long templateId;
    private Long userId;
    private LocalDateTime signedAt;
    private String ipAddress;
    private ConsentStatus status;
    private String signatureHash;
    private String auditLog;
}
