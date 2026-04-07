package com.consentapp.service;

import com.consentapp.dto.TemplateRequest;
import com.consentapp.dto.TemplateResponse;
import com.consentapp.dto.TemplateStatsResponse;
import com.consentapp.dto.StudentStatusDto;
import com.consentapp.entity.ConsentTemplate;
import com.consentapp.entity.ConsentRecord;
import com.consentapp.entity.Role;
import com.consentapp.entity.User;
import com.consentapp.exception.ResourceNotFoundException;
import com.consentapp.repository.ConsentTemplateRepository;
import com.consentapp.repository.ConsentRecordRepository;
import com.consentapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.ArrayList;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TemplateService {

    private final ConsentTemplateRepository templateRepository;
    private final UserRepository userRepository;
    private final ConsentRecordRepository consentRecordRepository;

    @Transactional
    @SuppressWarnings("null")
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
        log.info("Created new template v1.0: {}", template.getTitle());
        return mapToResponse(template);
    }

    @Transactional
    @SuppressWarnings("null")
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
        log.info("Modified template: v{} -> v{}", oldTemplate.getVersion(), newTemplate.getVersion());
        return mapToResponse(newTemplate);
    }

    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public Page<TemplateResponse> getAllTemplates(Pageable pageable, String search) {
        if (search != null && !search.isEmpty()) {
            return templateRepository.findByTitleContainingIgnoreCase(search, pageable)
                    .map(this::mapToResponse);
        }
        return templateRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public Page<TemplateResponse> getActiveTemplates(String userEmail, Pageable pageable, String search) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == Role.STUDENT) {
            final Long studentId = user.getId();
            if (search != null && !search.isEmpty()) {
                return templateRepository.findAssignedTemplatesWithSearch(studentId, search, pageable)
                        .map(this::mapToResponse);
            }
            return templateRepository.findAssignedTemplates(studentId, pageable)
                    .map(this::mapToResponse);
        }

        if (search != null && !search.isEmpty()) {
            return templateRepository.findByIsActiveTrueAndTitleContainingIgnoreCase(search, pageable)
                    .map(this::mapToResponse);
        }
        return templateRepository.findByIsActiveTrue(pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public TemplateResponse getTemplateById(Long id) {
        ConsentTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + id));
        return mapToResponse(template);
    }

    @Transactional
    @SuppressWarnings("null")
    public void deleteTemplate(Long id) {
        ConsentTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + id));
        // Soft delete
        template.setIsActive(false);
        templateRepository.save(template);
    }

    @Transactional
    @SuppressWarnings("null")
    public TemplateResponse toggleTemplateStatus(Long id, boolean active) {
        ConsentTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + id));
        template.setIsActive(active);
        templateRepository.save(template);
        log.info("Template status toggled to {}: {}", active, template.getTitle());
        return mapToResponse(template);
    }

    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public List<TemplateResponse> getTemplateHistory(Long id) {
        ConsentTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + id));
        return templateRepository.findByTitleOrderByVersionDesc(template.getTitle())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public TemplateStatsResponse getTemplateStats(Long id) {
        ConsentTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + id));

        List<ConsentRecord> consents = consentRecordRepository.findByTemplateId(id);

        List<StudentStatusDto> students = new ArrayList<>();
        int signedCount = 0;
        int pendingCount = 0;

        for (User student : template.getAssignedStudents()) {
            Optional<ConsentRecord> consentOpt = consents.stream()
                    .filter(c -> c.getUser().getId().equals(student.getId()))
                    .findFirst();

            boolean hasSigned = consentOpt.isPresent();
            LocalDateTime signedAt = hasSigned ? consentOpt.get().getSignedAt() : null;

            students.add(new StudentStatusDto(
                    student.getId(),
                    student.getName(),
                    student.getEmail(),
                    hasSigned,
                    signedAt
            ));

            if (hasSigned) {
                signedCount++;
            } else {
                pendingCount++;
            }
        }

        return new TemplateStatsResponse(
                template.getAssignedStudents().size(),
                signedCount,
                pendingCount,
                students
        );
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
