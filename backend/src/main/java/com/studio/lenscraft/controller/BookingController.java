package com.studio.lenscraft.controller;

import com.studio.lenscraft.dto.BookingDtos.BookingRequest;
import com.studio.lenscraft.dto.BookingDtos.BookingUpdate;
import com.studio.lenscraft.model.Booking;
import com.studio.lenscraft.repository.BookingRepository;
import com.studio.lenscraft.service.BookingService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class BookingController {
  private final BookingService bookingService;
  private final BookingRepository bookings;

  public BookingController(BookingService bookingService, BookingRepository bookings) {
    this.bookingService = bookingService;
    this.bookings = bookings;
  }

  @PostMapping("/bookings")
  Booking create(@Valid @RequestBody BookingRequest request) {
    return bookingService.create(request);
  }

  @GetMapping("/client/bookings/{reference}")
  Booking clientBooking(@PathVariable String reference) {
    return bookings.findByReference(reference).orElseThrow();
  }

  @GetMapping("/admin/bookings")
  List<Booking> all() {
    return bookings.findAll();
  }

  @PatchMapping("/admin/bookings/{id}")
  Booking update(@PathVariable Long id, @RequestBody BookingUpdate update) {
    return bookingService.update(id, update);
  }
}
