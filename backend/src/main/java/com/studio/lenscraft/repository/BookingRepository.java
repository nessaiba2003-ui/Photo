package com.studio.lenscraft.repository;

import com.studio.lenscraft.model.Booking;
import com.studio.lenscraft.model.BookingStatus;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
  Optional<Booking> findByReference(String reference);
  List<Booking> findByStatus(BookingStatus status);
  boolean existsByPreferredDateAndPreferredTimeAndStatusIn(LocalDate date, LocalTime time, List<BookingStatus> statuses);
}
