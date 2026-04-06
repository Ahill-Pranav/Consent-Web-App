package com.consentapp.config;

import com.consentapp.entity.Role;
import com.consentapp.entity.User;
import com.consentapp.entity.ConsentTemplate;
import com.consentapp.entity.ConsentRecord;
import com.consentapp.entity.ConsentStatus;
import com.consentapp.repository.ConsentTemplateRepository;
import com.consentapp.repository.ConsentRecordRepository;
import com.consentapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ConsentTemplateRepository templateRepository;
    private final ConsentRecordRepository recordRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @SuppressWarnings("null")
    public void run(String... args) throws Exception {
        // 1. Ensure admin exists with correct credentials
        userRepository.findByEmail("admin@gmail.com").ifPresentOrElse(
                admin -> {
                    admin.setPassword(passwordEncoder.encode("admin"));
                    admin.setRole(Role.ADMIN);
                    userRepository.save(admin);
                },
                () -> {
                    User admin = User.builder()
                            .name("Admin")
                            .email("admin@gmail.com")
                            .password(passwordEncoder.encode("admin"))
                            .role(Role.ADMIN)
                            .build();
                    userRepository.save(admin);
                });

        // 2. Demote all other admins to MENTOR (to avoid FK constraints but ensure only
        // one admin)
        List<User> allAdmins = userRepository.findByRole(Role.ADMIN);
        for (User admin : allAdmins) {
            if (!admin.getEmail().equalsIgnoreCase("admin@gmail.com")) {
                admin.setRole(Role.MENTOR);
                userRepository.save(admin);
            }
        }

        // 3. Populate default Mentors
        createMentorIfNotExists("mentor1@gmail.com", "John Mentor");
        createMentorIfNotExists("mentor2@gmail.com", "Sarah Mentor");
        createMentorIfNotExists("mentor3@gmail.com", "David Mentor");

        // 4. Populate default Students
        User mentor1 = userRepository.findByEmail("mentor1@gmail.com")
                .orElseThrow(() -> new RuntimeException("Mentor1 not found"));

        User mentor2 = userRepository.findByEmail("mentor2@gmail.com")
                .orElseThrow(() -> new RuntimeException("Mentor2 not found"));

        createStudentIfNotExists("student1@gmail.com", "Alice Student", mentor1);
        createStudentIfNotExists("student2@gmail.com", "Bob Student", mentor1);
        createStudentIfNotExists("student3@gmail.com", "Charlie Student", mentor2);
        createStudentIfNotExists("student4@gmail.com", "Diana Student", mentor2);
        createStudentIfNotExists("student5@gmail.com", "Eve Student", mentor2);

        // 5. Seed actual templates
        User admin = userRepository.findByEmail("admin@gmail.com").orElse(null);
        if (admin != null && templateRepository.count() == 0) {
            seedTemplates(admin);
        }
    }

    @SuppressWarnings("null")
    private void seedTemplates(User admin) {
        // 1. Ethics Approval
        ConsentTemplate ethics = ConsentTemplate.builder()
                .title("Ethics Approval for Research")
                .description("Mandatory ethics consent for all research projects involving human subjects.")
                .content("I hereby give my consent to participate in the research study... [Detailed Ethics Content]")
                .createdBy(admin)
                .isActive(true)
                .version(1)
                .build();

        // 2. Lab Safety
        ConsentTemplate labSafety = ConsentTemplate.builder()
                .title("Laboratory Safety Agreement")
                .description("Safety guidelines and risk acknowledgment for laboratory work.")
                .content("I acknowledge that I have read and understood the laboratory safety protocols... [Detailed Safety Content]")
                .createdBy(admin)
                .isActive(true)
                .version(1)
                .build();

        // 3. Field Trip
        ConsentTemplate fieldTrip = ConsentTemplate.builder()
                .title("Field Trip Participation & Liability Waiver")
                .description("Consent for participating in off-campus academic field trips.")
                .content("I agree to participate in the scheduled field trip and acknowledge the risks... [Detailed Field Trip Content]")
                .createdBy(admin)
                .isActive(true)
                .version(1)
                .build();

        // 4. Non-Disclosure Agreement (NDA)
        ConsentTemplate nda = ConsentTemplate.builder()
                .title("Non-Disclosure Agreement (NDA)")
                .description("Confidentiality agreement for project-specific sensitive data.")
                .content("I agree to keep all project information confidential and not disclose it to third parties... [Detailed NDA Content]")
                .createdBy(admin)
                .isActive(true)
                .version(1)
                .build();

        // 5. Equipment Usage Policy
        ConsentTemplate equipment = ConsentTemplate.builder()
                .title("Specialized Equipment Usage Policy")
                .description("Terms and conditions for using high-end laboratory instrumentation.")
                .content("I agree to handle all equipment with care and follow the operational guidelines... [Detailed Equipment Content]")
                .createdBy(admin)
                .isActive(true)
                .version(1)
                .build();

        // 6. Data Privacy & Protection
        ConsentTemplate privacy = ConsentTemplate.builder()
                .title("Data Privacy & Protection Consent")
                .description("Consent for the processing and storage of personal academic data.")
                .content("I agree to the storage and processing of my academic data for university purposes... [Detailed Privacy Content]")
                .createdBy(admin)
                .isActive(true)
                .version(1)
                .build();

        // 7. AI Usage Policy
        ConsentTemplate aiUsage = ConsentTemplate.builder()
                .title("Academic AI Usage Policy")
                .description("Guidelines and consent for using AI tools in coursework and research.")
                .content("I agree to use AI tools ethically and disclose their usage in my academic work... [Detailed AI Policy Content]")
                .createdBy(admin)
                .isActive(true)
                .version(1)
                .build();

        // 8. Social Media & Marketing
        ConsentTemplate socialMedia = ConsentTemplate.builder()
                .title("Social Media & Marketing Consent")
                .description("Permission to use student photos and work for university promotion.")
                .content("I give permission to the university to use my photos and creative work for social media... [Detailed Social Media Content]")
                .createdBy(admin)
                .isActive(true)
                .version(1)
                .build();

        // 9. Medical Disclosure
        ConsentTemplate medical = ConsentTemplate.builder()
                .title("Voluntary Medical Disclosure")
                .description("Disclosure of medical conditions for safety during field-work.")
                .content("I voluntarily disclose any medical conditions that may affect my safety during field-work... [Detailed Medical Content]")
                .createdBy(admin)
                .isActive(true)
                .version(1)
                .build();

        templateRepository.saveAll(List.of(
                ethics, labSafety, fieldTrip, nda, equipment, privacy, aiUsage, socialMedia, medical
        ));

        // Get all students
        User student1 = userRepository.findByEmail("student1@gmail.com").orElse(null);
        User student2 = userRepository.findByEmail("student2@gmail.com").orElse(null);
        User student3 = userRepository.findByEmail("student3@gmail.com").orElse(null);
        User student4 = userRepository.findByEmail("student4@gmail.com").orElse(null);

        // Assign Templates to Students
        if (student1 != null) {
            ethics.setAssignedStudents(Set.of(student1));
            labSafety.setAssignedStudents(Set.of(student1));
            privacy.setAssignedStudents(Set.of(student1));
            aiUsage.setAssignedStudents(Set.of(student1));
            
            // Seed a signed record for student1
            recordRepository.save(ConsentRecord.builder()
                    .template(ethics)
                    .user(student1)
                    .signedAt(LocalDateTime.now().minusDays(5))
                    .status(ConsentStatus.SIGNED)
                    .signatureHash(UUID.randomUUID().toString())
                    .auditLog("Signed from IP 192.168.1.10")
                    .build());
        }

        if (student2 != null) {
            ethics.setAssignedStudents(Set.of(student2));
            fieldTrip.setAssignedStudents(Set.of(student2));
            nda.setAssignedStudents(Set.of(student2));
            socialMedia.setAssignedStudents(Set.of(student2));
        }

        if (student3 != null) {
            labSafety.setAssignedStudents(Set.of(student3));
            equipment.setAssignedStudents(Set.of(student3));
            medical.setAssignedStudents(Set.of(student3));
            aiUsage.setAssignedStudents(Set.of(student3));
        }

        if (student4 != null) {
            fieldTrip.setAssignedStudents(Set.of(student4));
            privacy.setAssignedStudents(Set.of(student4));
            nda.setAssignedStudents(Set.of(student4));
        }

        // Final save all updated templates with assignments
        templateRepository.saveAll(List.of(
                ethics, labSafety, fieldTrip, nda, equipment, privacy, aiUsage, socialMedia, medical
        ));
    }

    @SuppressWarnings("null")
    private void createMentorIfNotExists(String email, String name) {
        if (!userRepository.existsByEmail(email)) {
            User mentor = User.builder()
                    .name(name)
                    .email(email)
                    .password(passwordEncoder.encode("password123"))
                    .role(Role.MENTOR)
                    .build();
            userRepository.save(mentor);
        }
    }

    @SuppressWarnings("null")
    private void createStudentIfNotExists(String email, String name, User mentor) {
        if (!userRepository.existsByEmail(email)) {
            User student = User.builder()
                    .name(name)
                    .email(email)
                    .password(passwordEncoder.encode("password123"))
                    .role(Role.STUDENT)
                    .mentor(mentor)
                    .build();
            userRepository.save(student);
        }
    }
}
