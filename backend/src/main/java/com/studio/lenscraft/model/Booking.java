package com.studio.lenscraft.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "bookings", indexes = {@Index(name = "idx_booking_reference", columnList = "reference", unique = true), @Index(name = "idx_booking_status", columnList = "status"), @Index(name = "idx_booking_date_time", columnList = "preferredDate,preferredTime")})
public class Booking {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String reference;

  @ManyToOne(cascade = CascadeType.PERSIST)
  @JoinColumn(name = "client_id", nullable = false)
  private Client client;

  @ManyToOne
  @JoinColumn(name = "service_id", nullable = false)
  @JsonIgnoreProperties("packages")
  private PhotographyService service;

  @ManyToOne
  @JoinColumn(name = "package_id", nullable = false)
  private ServicePackage servicePackage;

  @Column(nullable = false)
  private LocalDate preferredDate;

  @Column(nullable = false)
  private LocalTime preferredTime;

  @Column(nullable = false)
  private String location;

  @Column(nullable = false)
  private String duration;

  @Column(length = 1600)
  private String message;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private BookingStatus status = BookingStatus.PENDING;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private PaymentStatus paymentStatus = PaymentStatus.UNPAID;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private DeliveryStatus deliveryStatus = DeliveryStatus.NOT_STARTED;

  @Column(length = 1600)
  private String photographerNotes;

  private String secureGalleryUrl;
}
