package com.studio.lenscraft.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "availability", indexes = @Index(name = "idx_availability_date", columnList = "date"))
public class Availability {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private LocalDate date;

  private LocalTime startTime;
  private LocalTime endTime;

  @Column(nullable = false)
  private boolean blocked = true;

  @Column(length = 800)
  private String reason;
}
