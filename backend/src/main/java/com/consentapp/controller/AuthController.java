package com.consentapp.controller;

import com.consentapp.dto.AuthRequest;
import com.consentapp.dto.AuthResponse;
import com.consentapp.dto.RegisterRequest;
import com.consentapp.entity.Role;
import com.consentapp.entity.User;
import com.consentapp.exception.ValidationException;
import com.consentapp.repository.UserRepository;
import com.consentapp.security.CustomUserDetails;
import com.consentapp.security.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ValidationException("Email is already in use.");
        }

        Role assignedRole = Role.STUDENT;
        if (request.getRole() != null) {
            try {
                assignedRole = Role.valueOf(request.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                // Default to STUDENT if invalid
            }
        }
        
        if (request.getEmail().equalsIgnoreCase("admin@gmail.com")) {
            assignedRole = Role.ADMIN;
        }

        User mentor = null;
        if (assignedRole == Role.STUDENT && request.getMentorId() != null) {
            mentor = userRepository.findById(request.getMentorId())
                    .orElseThrow(() -> new ValidationException("Selected mentor not found."));
            if (mentor.getRole() != Role.MENTOR && mentor.getRole() != Role.ADMIN) {
                throw new ValidationException("Selected user is not a mentor.");
            }
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(assignedRole)
                .mentor(mentor)
                .build();

        userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String jwtToken = jwtService.generateToken(userDetails);

        return ResponseEntity.status(HttpStatus.CREATED).body(AuthResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .build());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        CustomUserDetails userDetails = (CustomUserDetails) userDetailsService.loadUserByUsername(request.getEmail());
        String jwtToken = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(AuthResponse.builder()
                .token(jwtToken)
                .email(userDetails.getUser().getEmail())
                .name(userDetails.getUser().getName())
                .role(userDetails.getUser().getRole().name())
                .build());
    }

    @GetMapping("/mentors")
    public ResponseEntity<List<Map<String, Object>>> getMentors() {
        List<User> mentors = userRepository.findByRole(Role.MENTOR);
        List<Map<String, Object>> mentorList = mentors.stream().map(m -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", m.getId());
            map.put("name", m.getName());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(mentorList);
    }

    @GetMapping("/my-students")
    public ResponseEntity<List<Map<String, Object>>> getMyStudents(org.springframework.security.core.Authentication authentication) {
        User mentor = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ValidationException("Mentor not found"));
        
        List<User> students = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.STUDENT && u.getMentor() != null && u.getMentor().getId().equals(mentor.getId()))
                .collect(Collectors.toList());

        List<Map<String, Object>> studentList = students.stream().map(s -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", s.getId());
            map.put("name", s.getName());
            map.put("email", s.getEmail());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(studentList);
    }

    @GetMapping("/users")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> userList = users.stream().map(u -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("name", u.getName());
            map.put("email", u.getEmail());
            map.put("role", u.getRole().name());
            map.put("mentorName", u.getMentor() != null ? u.getMentor().getName() : null);
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(userList);
    }

    @DeleteMapping("/users/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            throw new ValidationException("User not found");
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
