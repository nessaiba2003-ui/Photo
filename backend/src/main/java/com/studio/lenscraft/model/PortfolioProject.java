package com.studio.lenscraft.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "portfolio_projects", indexes = {@Index(name = "idx_project_category", columnList = "category"), @Index(name = "idx_project_featured", columnList = "featured")})
public class PortfolioProject {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  private String titleFr;

  @Column(nullable = false, length = 1800)
  private String description;

  @Column(length = 1800)
  private String descriptionFr;

  private LocalDate projectDate;
  private String location;
  private String category;
  private String coverImageUrl;
  private boolean featured;

  @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
  private List<PortfolioMedia> media = new ArrayList<>();
}
