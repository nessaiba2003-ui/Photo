package com.studio.lenscraft.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthDtos {
  public record LoginRequest(@Email String email, @NotBlank String password) {}
  public record LoginResponse(String token, String email, String role) {}
}
