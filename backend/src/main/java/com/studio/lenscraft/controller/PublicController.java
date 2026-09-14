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
    return Map.ofEntries(
        Map.entry("brand", "ALBATROS"),
        Map.entry("founder", "Hamza Elbahi"),
        Map.entry("role", "Photographer - Videographer - Video Editor"),
        Map.entry("tagline", "Rabat-based cinematic stories for weddings, brands, artists, and unforgettable nights."),
        Map.entry("email", "hamzaelbahi.orion@gmail.com"),
        Map.entry("phone", "+212 772 604 428"),
        Map.entry("instagram", "https://www.instagram.com/orion.polaris"),
        Map.entry("whatsapp", "https://wa.me/212772604428"),
        Map.entry("location", "Rabat, Morocco"),
        Map.entry("services", services.findByActiveTrueOrderByNameAsc()),
        Map.entry("featuredProjects", projects.findByFeaturedTrueOrderByProjectDateDesc()),
        Map.entry("testimonials", testimonials.findByFeaturedTrue()));
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
