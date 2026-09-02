package com.studio.lenscraft.service;

import com.studio.lenscraft.dto.AuthDtos.LoginRequest;
import com.studio.lenscraft.dto.AuthDtos.LoginResponse;
import com.studio.lenscraft.exception.ApiException;
import com.studio.lenscraft.model.AdminUser;
import com.studio.lenscraft.repository.AdminUserRepository;
import com.studio.lenscraft.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
  private final AdminUserRepository admins;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthService(AdminUserRepository admins, PasswordEncoder passwordEncoder, JwtService jwtService) {
    this.admins = admins;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  public LoginResponse login(LoginRequest request) {
    AdminUser admin = admins.findByEmail(request.email()).orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
    if (!passwordEncoder.matches(request.password(), admin.getPasswordHash())) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }
    return new LoginResponse(jwtService.issue(admin.getEmail(), admin.getRole().name()), admin.getEmail(), admin.getRole().name());
  }
}
