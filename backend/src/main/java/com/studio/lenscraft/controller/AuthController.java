package com.studio.lenscraft.controller;

import com.studio.lenscraft.dto.AuthDtos.LoginRequest;
import com.studio.lenscraft.dto.AuthDtos.LoginResponse;
import com.studio.lenscraft.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/login")
  LoginResponse login(@Valid @RequestBody LoginRequest request) {
    return authService.login(request);
  }
}
