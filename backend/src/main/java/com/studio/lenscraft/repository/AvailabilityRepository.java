package com.studio.lenscraft.repository;

import com.studio.lenscraft.model.Availability;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
  List<Availability> findByDateBetween(LocalDate start, LocalDate end);

  @Query("""
      select count(a) > 0 from Availability a
      where a.date = :date
        and a.blocked = true
        and (
          a.startTime is null
          or a.endTime is null
          or (a.startTime <= :time and a.endTime >= :time)
        )
      """)
  boolean isBlocked(@Param("date") LocalDate date, @Param("time") LocalTime time);
}
