package com.studio.lenscraft.repository;

import com.studio.lenscraft.model.PortfolioProject;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioProjectRepository extends JpaRepository<PortfolioProject, Long> {
  List<PortfolioProject> findByFeaturedTrueOrderByProjectDateDesc();
  List<PortfolioProject> findByCategoryIgnoreCaseOrderByProjectDateDesc(String category);
}
