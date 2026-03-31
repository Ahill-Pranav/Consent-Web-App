package com.consentapp.config;

import com.consentapp.entity.Role;
import com.consentapp.entity.User;
import com.consentapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
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
