package com.consentapp.dto;

import java.time.LocalDateTime;

public class StudentStatusDto {
    private Long id;
    private String name;
    private String email;
    private boolean hasSigned;
    private LocalDateTime signedAt;

    public StudentStatusDto() {}

    public StudentStatusDto(Long id, String name, String email, boolean hasSigned, LocalDateTime signedAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.hasSigned = hasSigned;
        this.signedAt = signedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public boolean isHasSigned() { return hasSigned; }
    public void setHasSigned(boolean hasSigned) { this.hasSigned = hasSigned; }
    public LocalDateTime getSignedAt() { return signedAt; }
    public void setSignedAt(LocalDateTime signedAt) { this.signedAt = signedAt; }
}
