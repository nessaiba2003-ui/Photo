package com.studio.lenscraft.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "portfolio_media")
public class PortfolioMedia {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private MediaType type;

  @Column(nullable = false)
  private String url;

  private String altText;
  private Integer sortOrder = 0;

  @ManyToOne
  @JoinColumn(name = "project_id", nullable = false)
  @JsonIgnoreProperties("media")
  private PortfolioProject project;
}
