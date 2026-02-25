
package com.consentapp.controller;

import com.consentapp.dto.ConsentResponse;
import com.consentapp.service.ConsentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consents")
@RequiredArgsConstructor
public class ConsentController {

    private final ConsentService consentService;

    @PostMapping("/{templateId}/sign")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ConsentResponse> signConsent(
            @PathVariable Long templateId,
            HttpServletRequest request,
            Authentication authentication) {

        String userEmail = authentication.getName();
        String ipAddress = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");

        // Consider getting real IP if behind proxies:
        // request.getHeader("X-Forwarded-For")
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isEmpty()) {
            ipAddress = forwardedFor.split(",")[0];
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(consentService.signConsent(templateId, userEmail, ipAddress, userAgent));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<ConsentResponse>> getMyConsents(Authentication authentication) {
        return ResponseEntity.ok(consentService.getMyConsents(authentication.getName()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ConsentResponse>> getAllConsents() {
        return ResponseEntity.ok(consentService.getAllConsents());
    }
}
