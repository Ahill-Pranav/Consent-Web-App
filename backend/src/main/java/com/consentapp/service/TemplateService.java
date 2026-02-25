package com.consentapp.service;

import com.consentapp.dto.TemplateRequest;
import com.consentapp.dto.TemplateResponse;
import com.consentapp.entity.ConsentTemplate;
import com.consentapp.entity.User;
import com.consentapp.exception.ResourceNotFoundException;
import com.consentapp.repository.ConsentTemplateRepository;
import com.consentapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TemplateService {

    private final ConsentTemplateRepository templateRepository;
    private final UserRepository userRepository;

    @Transactional
    public TemplateResponse createTemplate(TemplateRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ConsentTemplate template = ConsentTemplate.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .content(request.getContent())
                .createdBy(user)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        templateRepository.save(template);
        return mapToResponse(template);
    }

    @Transactional
    public TemplateResponse updateTemplate(Long id, TemplateRequest request) {
        ConsentTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + id));

        template.setTitle(request.getTitle());
        template.setDescription(request.getDescription());
        template.setContent(request.getContent());
        if (request.getIsActive() != null) {
            template.setIsActive(request.getIsActive());
        }

        templateRepository.save(template);
        return mapToResponse(template);
    }

    @Transactional(readOnly = true)
    public List<TemplateResponse> getAllTemplates() {
        return templateRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TemplateResponse> getActiveTemplates() {
        return templateRepository.findByIsActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TemplateResponse getTemplateById(Long id) {
        ConsentTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + id));
        return mapToResponse(template);
    }

    @Transactional
    public void deleteTemplate(Long id) {
        ConsentTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + id));
        // Soft delete
        template.setIsActive(false);
        templateRepository.save(template);
    }

    private TemplateResponse mapToResponse(ConsentTemplate template) {
        return TemplateResponse.builder()
                .id(template.getId())
                .title(template.getTitle())
                .description(template.getDescription())
                .content(template.getContent())
                .isActive(template.getIsActive())
                .createdBy(template.getCreatedBy().getEmail())
                .createdAt(template.getCreatedAt())
                .updatedAt(template.getUpdatedAt())
                .build();
    }
}
