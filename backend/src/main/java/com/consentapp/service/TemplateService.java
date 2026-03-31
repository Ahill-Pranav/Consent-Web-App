package com.consentapp.service;

import com.consentapp.dto.TemplateRequest;
import com.consentapp.dto.TemplateResponse;
import com.consentapp.entity.ConsentTemplate;
import com.consentapp.entity.Role;
import com.consentapp.entity.User;
import com.consentapp.exception.ResourceNotFoundException;
import com.consentapp.exception.ValidationException;
import com.consentapp.repository.ConsentTemplateRepository;
import com.consentapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
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

        Set<User> assignedStudents = new HashSet<>();
        if (request.getAssignedStudentIds() != null) {
            assignedStudents.addAll(userRepository.findAllById(request.getAssignedStudentIds()));
        }

        ConsentTemplate template = ConsentTemplate.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .content(request.getContent())
                .createdBy(user)
                .isActive(request.getActive() != null ? request.getActive() : true)
                .assignedStudents(assignedStudents)
                .build();

        templateRepository.save(template);
        return mapToResponse(template);
    }

    @Transactional
    public TemplateResponse updateTemplate(Long id, TemplateRequest request) {
        ConsentTemplate oldTemplate = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + id));

        oldTemplate.setIsActive(false);
        templateRepository.save(oldTemplate);

        Set<User> assignedStudents = new HashSet<>();
        if (request.getAssignedStudentIds() != null) {
            assignedStudents.addAll(userRepository.findAllById(request.getAssignedStudentIds()));
        } else {
            assignedStudents.addAll(oldTemplate.getAssignedStudents());
        }

        ConsentTemplate newTemplate = ConsentTemplate.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .content(request.getContent())
                .createdBy(oldTemplate.getCreatedBy())
                .isActive(request.getActive() != null ? request.getActive() : true)
                .parentTemplate(oldTemplate.getParentTemplate() == null ? oldTemplate : oldTemplate.getParentTemplate())
                .version(oldTemplate.getVersion() + 1)
                .assignedStudents(assignedStudents)
                .build();

        templateRepository.save(newTemplate);
        return mapToResponse(newTemplate);
    }

    @Transactional(readOnly = true)
    public List<TemplateResponse> getAllTemplates() {
        return templateRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TemplateResponse> getActiveTemplates(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<ConsentTemplate> templates = templateRepository.findByIsActiveTrue();

        if (user.getRole() == Role.STUDENT) {
            // Filter templates assigned to this student
            templates = templates.stream()
                    .filter(t -> t.getAssignedStudents().contains(user))
                    .collect(Collectors.toList());
        }

        return templates.stream()
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
        TemplateResponse response = new TemplateResponse();
        response.setId(template.getId());
        response.setTitle(template.getTitle());
        response.setDescription(template.getDescription());
        response.setContent(template.getContent());
        response.setActive(template.getIsActive());
        response.setCreatedBy(template.getCreatedBy().getEmail());
        response.setCreatedAt(template.getCreatedAt());
        response.setUpdatedAt(template.getUpdatedAt());
        response.setVersion(template.getVersion());
        response.setAssignedStudentIds(template.getAssignedStudents().stream()
                .map(User::getId)
                .collect(Collectors.toList()));
        return response;
    }
}
