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

        // The first registered user could be ADMIN for testing purposes, or standard
        // USER.
        // Let's make everyone USER by default, but if email is admin@consent.app make
        // them admin.
        Role assignedRole = Role.USER;
        if (request.getEmail().equalsIgnoreCase("admin@consent.app")) {
            assignedRole = Role.ADMIN;
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(assignedRole)
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
}
