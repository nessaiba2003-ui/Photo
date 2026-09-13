package com.studio.lenscraft.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "testimonials")
public class Testimonial {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String clientName;

  @Column(nullable = false, length = 1600)
  private String review;

  @Column(length = 1600)
  private String reviewFr;

  private String photoUrl;
  private String projectOrService;
  private String projectOrServiceFr;
  private boolean featured = true;
}
