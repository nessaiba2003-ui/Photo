package com.studio.lenscraft.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "service_packages", indexes = @Index(name = "idx_package_service", columnList = "service_id"))
public class ServicePackage {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Column(nullable = false)
  private String name;

  @Column(nullable = false, length = 1600)
  private String includes;

  @Column(nullable = false)
  private String duration;

  @Column(nullable = false)
  private Integer editedAssets;

  @PositiveOrZero
  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal price;

  @ManyToOne
  @JoinColumn(name = "service_id", nullable = false)
  @JsonIgnoreProperties("packages")
  private PhotographyService service;
}
