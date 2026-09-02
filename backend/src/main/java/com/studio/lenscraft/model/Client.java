package com.studio.lenscraft.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "clients", indexes = {@Index(name = "idx_client_email", columnList = "email"), @Index(name = "idx_client_phone", columnList = "phone")})
public class Client {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Column(nullable = false)
  private String name;

  @Column(nullable = false)
  private String phone;

  @Email
  @Column(nullable = false)
  private String email;

  private String instagram;

  @Column(length = 1200)
  private String notes;
}
