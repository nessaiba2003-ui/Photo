package com.studio.lenscraft.controller;

import com.studio.lenscraft.model.*;
import com.studio.lenscraft.repository.*;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
public class PublicController {
  private final PhotographyServiceRepository services;
  private final PortfolioProjectRepository projects;
  private final TestimonialRepository testimonials;

  public PublicController(PhotographyServiceRepository services, PortfolioProjectRepository projects, TestimonialRepository testimonials) {
    this.services = services;
    this.projects = projects;
    this.testimonials = testimonials;
  }

  @GetMapping("/site")
  Map<String, Object> site() {
    return Map.of(
        "brand", "ALBATROS",
        "role", "Photographer - Videographer - Video Editor",
        "tagline", "Rabat-based cinematic stories for weddings, brands, artists, and unforgettable nights.",
        "services", services.findByActiveTrueOrderByNameAsc(),
        "featuredProjects", projects.findByFeaturedTrueOrderByProjectDateDesc(),
        "testimonials", testimonials.findByFeaturedTrue());
  }

  @GetMapping("/services")
  List<PhotographyService> services() {
    return services.findByActiveTrueOrderByNameAsc();
  }

  @GetMapping("/portfolio")
  List<PortfolioProject> portfolio(@RequestParam(required = false) String category) {
    return category == null || category.equalsIgnoreCase("all")
        ? projects.findAll()
        : projects.findByCategoryIgnoreCaseOrderByProjectDateDesc(category);
  }
}
