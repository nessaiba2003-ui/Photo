package com.studio.lenscraft.repository;

import com.studio.lenscraft.model.ServicePackage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServicePackageRepository extends JpaRepository<ServicePackage, Long> {
  List<ServicePackage> findByServiceId(Long serviceId);
}
