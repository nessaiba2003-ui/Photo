package com.studio.lenscraft.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "services", indexes = @Index(name = "idx_service_active", columnList = "active"))
public class PhotographyService {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Column(nullable = false)
  private String name;

  private String nameFr;

  @Column(nullable = false, length = 1200)
  private String description;

  @Column(length = 1200)
  private String descriptionFr;

  @Column(nullable = false)
  private boolean active = true;

  @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
  private List<ServicePackage> packages = new ArrayList<>();
}
