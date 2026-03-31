package com.consentapp.dto;

import com.consentapp.entity.ConsentStatus;
import java.time.LocalDateTime;

public class ConsentResponse {

    private Long id;
    private Long templateId;
    private Long userId;
    private LocalDateTime signedAt;
    private String ipAddress;
    private ConsentStatus status;
    private String signatureHash;
    private String auditLog;

    public ConsentResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getTemplateId() { return templateId; }
    public void setTemplateId(Long templateId) { this.templateId = templateId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public LocalDateTime getSignedAt() { return signedAt; }
    public void setSignedAt(LocalDateTime signedAt) { this.signedAt = signedAt; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public ConsentStatus getStatus() { return status; }
    public void setStatus(ConsentStatus status) { this.status = status; }
    public String getSignatureHash() { return signatureHash; }
    public void setSignatureHash(String signatureHash) { this.signatureHash = signatureHash; }
    public String getAuditLog() { return auditLog; }
    public void setAuditLog(String auditLog) { this.auditLog = auditLog; }
}
