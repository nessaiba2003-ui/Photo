package com.studio.lenscraft.service;

import com.studio.lenscraft.dto.BookingDtos.BookingRequest;
import com.studio.lenscraft.dto.BookingDtos.BookingUpdate;
import com.studio.lenscraft.exception.ApiException;
import com.studio.lenscraft.model.*;
import com.studio.lenscraft.repository.*;
import java.security.SecureRandom;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookingService {
  private static final String ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  private static final SecureRandom RANDOM = new SecureRandom();

  private final BookingRepository bookings;
  private final PhotographyServiceRepository services;
  private final ServicePackageRepository packages;
  private final AvailabilityRepository availability;

  public BookingService(BookingRepository bookings, PhotographyServiceRepository services, ServicePackageRepository packages, AvailabilityRepository availability) {
    this.bookings = bookings;
    this.services = services;
    this.packages = packages;
    this.availability = availability;
  }

  @Transactional
  public Booking create(BookingRequest request) {
    PhotographyService service = services.findById(request.serviceId()).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Service not found"));
    ServicePackage servicePackage = packages.findById(request.packageId()).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Package not found"));
    if (!servicePackage.getService().getId().equals(service.getId())) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Package does not belong to selected service");
    }
    ensureSlotIsAvailable(request.preferredDate(), request.preferredTime());

    Client client = new Client();
    client.setName(request.name());
    client.setPhone(request.phone());
    client.setEmail(request.email());
    client.setInstagram(request.instagram());

    Booking booking = new Booking();
    booking.setReference(nextReference());
    booking.setClient(client);
    booking.setService(service);
    booking.setServicePackage(servicePackage);
    booking.setPreferredDate(request.preferredDate());
    booking.setPreferredTime(request.preferredTime());
    booking.setLocation(request.location());
    booking.setDuration(request.duration());
    booking.setMessage(request.message());
    return bookings.save(booking);
  }

  @Transactional
  public Booking update(Long id, BookingUpdate update) {
    Booking booking = bookings.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Booking not found"));
    if (update.preferredDate() != null && update.preferredTime() != null) {
      ensureSlotIsAvailable(update.preferredDate(), update.preferredTime());
      booking.setPreferredDate(update.preferredDate());
      booking.setPreferredTime(update.preferredTime());
    }
    if (update.status() != null) booking.setStatus(update.status());
    if (update.photographerNotes() != null) booking.setPhotographerNotes(update.photographerNotes());
    if (update.paymentStatus() != null) booking.setPaymentStatus(update.paymentStatus());
    if (update.deliveryStatus() != null) booking.setDeliveryStatus(update.deliveryStatus());
    if (update.secureGalleryUrl() != null) booking.setSecureGalleryUrl(update.secureGalleryUrl());
    return booking;
  }

  private void ensureSlotIsAvailable(java.time.LocalDate date, java.time.LocalTime time) {
    boolean blocked = availability.isBlocked(date, time);
    boolean taken = bookings.existsByPreferredDateAndPreferredTimeAndStatusIn(date, time, List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED));
    if (blocked || taken) {
      throw new ApiException(HttpStatus.CONFLICT, "This date and time is unavailable");
    }
  }

  private String nextReference() {
    String reference;
    do {
      StringBuilder builder = new StringBuilder("LC-");
      for (int i = 0; i < 8; i++) builder.append(ALPHABET.charAt(RANDOM.nextInt(ALPHABET.length())));
      reference = builder.toString();
    } while (bookings.findByReference(reference).isPresent());
    return reference;
  }
}
