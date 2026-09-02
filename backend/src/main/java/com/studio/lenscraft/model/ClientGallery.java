package com.studio.lenscraft.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "client_galleries", indexes = @Index(name = "idx_gallery_token", columnList = "accessToken", unique = true))
public class ClientGallery {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne
  @JoinColumn(name = "booking_id", nullable = false)
  private Booking booking;

  @Column(nullable = false)
  private String galleryUrl;

  @Column(nullable = false, unique = true)
  private String accessToken;

  private OffsetDateTime expiresAt;
}
