package com.consentapp.service;

import com.consentapp.dto.TemplateRequest;
import com.consentapp.entity.ConsentTemplate;
import com.consentapp.entity.User;
import com.consentapp.repository.ConsentTemplateRepository;
import com.consentapp.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TemplateServiceTest {

    @Mock
    private ConsentTemplateRepository templateRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TemplateService templateService;

    private User mentor;
    private ConsentTemplate oldTemplate;

    @BeforeEach
    void setUp() {
        mentor = User.builder().id(1L).email("mentor@test.com").build();
        oldTemplate = ConsentTemplate.builder()
                .id(1L)
                .title("V1")
                .version(1)
                .isActive(true)
                .createdBy(mentor)
                .build();
    }

    @Test
    @SuppressWarnings("null")
    void whenUpdateTemplate_thenNewVersionCreated() {
        // Arrange
        TemplateRequest request = new TemplateRequest();
        request.setTitle("V2");
        request.setActive(true);

        when(templateRepository.findById(1L)).thenReturn(Optional.of(oldTemplate));
        
        // Act
        templateService.updateTemplate(1L, request);

        // Assert
        assertFalse(oldTemplate.getIsActive(), "Old template should be deactivated");
        verify(templateRepository, times(2)).save(any()); // Saves old (v1) and new (v2)
    }
}
