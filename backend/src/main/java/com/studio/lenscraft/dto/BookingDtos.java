package com.studio.lenscraft.dto;

import com.studio.lenscraft.model.BookingStatus;
import com.studio.lenscraft.model.DeliveryStatus;
import com.studio.lenscraft.model.PaymentStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public class BookingDtos {
  public record BookingRequest(
      @NotNull Long serviceId,
      @NotNull Long packageId,
      @FutureOrPresent LocalDate preferredDate,
      @NotNull LocalTime preferredTime,
      @NotBlank String location,
      @NotBlank String duration,
      @NotBlank String name,
      @NotBlank String phone,
      @Email String email,
      String instagram,
      String message) {}

  public record BookingUpdate(
      BookingStatus status,
      LocalDate preferredDate,
      LocalTime preferredTime,
      String photographerNotes,
      PaymentStatus paymentStatus,
      DeliveryStatus deliveryStatus,
      String secureGalleryUrl) {}
}
