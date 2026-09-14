package com.studio.lenscraft.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "site_settings")
public class SiteSettings {
  @Id
  private Long id = 1L;

  @Column(nullable = false)
  private String brand = "ALBATROS";

  @Column(nullable = false)
  private String founder = "Hamza Elbahi";

  @Column(nullable = false)
  private String role = "Photographer - Videographer - Video Editor";

  @Column(nullable = false, length = 1200)
  private String tagline = "Rabat-based cinematic stories for weddings, brands, artists, and unforgettable nights.";

  @Column(nullable = false)
  private String email = "hamzaelbahi.orion@gmail.com";

  @Column(nullable = false)
  private String phone = "+212 772 604 428";

  @Column(nullable = false)
  private String instagram = "https://www.instagram.com/orion.polaris";

  @Column(nullable = false)
  private String whatsapp = "https://wa.me/212772604428";

  @Column(nullable = false)
  private String location = "Rabat, Morocco";

  public static SiteSettings defaults() {
    return new SiteSettings();
  }
}
