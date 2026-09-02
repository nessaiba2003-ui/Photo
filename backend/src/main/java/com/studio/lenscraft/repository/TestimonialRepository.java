package com.studio.lenscraft.repository;

import com.studio.lenscraft.model.Testimonial;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestimonialRepository extends JpaRepository<Testimonial, Long> {
  List<Testimonial> findByFeaturedTrue();
}
