package com.studio.lenscraft.repository;

import com.studio.lenscraft.model.PhotographyService;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PhotographyServiceRepository extends JpaRepository<PhotographyService, Long> {
  List<PhotographyService> findByActiveTrueOrderByNameAsc();
}
