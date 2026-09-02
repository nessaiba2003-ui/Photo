package com.studio.lenscraft.controller;

import com.studio.lenscraft.model.*;
import com.studio.lenscraft.repository.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminCrudController {
  private final PhotographyServiceRepository services;
  private final ServicePackageRepository packages;
  private final PortfolioProjectRepository projects;
  private final AvailabilityRepository availability;
  private final TestimonialRepository testimonials;
  private final ClientRepository clients;
  private final BookingRepository bookings;

  public AdminCrudController(PhotographyServiceRepository services, ServicePackageRepository packages, PortfolioProjectRepository projects, AvailabilityRepository availability, TestimonialRepository testimonials, ClientRepository clients, BookingRepository bookings) {
    this.services = services;
    this.packages = packages;
    this.projects = projects;
    this.availability = availability;
    this.testimonials = testimonials;
    this.clients = clients;
    this.bookings = bookings;
  }

  @GetMapping("/overview")
  Map<String, Object> overview() {
    BigDecimal revenue = bookings.findAll().stream()
        .filter(b -> b.getPaymentStatus() == PaymentStatus.PAID)
        .map(b -> b.getServicePackage().getPrice())
        .reduce(BigDecimal.ZERO, BigDecimal::add);
    return Map.of(
        "totalBookings", bookings.count(),
        "pendingBookings", bookings.findByStatus(BookingStatus.PENDING).size(),
        "confirmedBookings", bookings.findByStatus(BookingStatus.CONFIRMED).size(),
        "completedProjects", bookings.findByStatus(BookingStatus.COMPLETED).size(),
        "revenue", revenue);
  }

  @GetMapping("/services")
  List<PhotographyService> services() { return services.findAll(); }

  @PostMapping("/services")
  PhotographyService saveService(@RequestBody PhotographyService service) { return services.save(service); }

  @DeleteMapping("/services/{id}")
  void deleteService(@PathVariable Long id) { services.deleteById(id); }

  @PostMapping("/services/{serviceId}/packages")
  ServicePackage savePackage(@PathVariable Long serviceId, @RequestBody ServicePackage request) {
    PhotographyService service = services.findById(serviceId).orElseThrow();
    request.setService(service);
    return packages.save(request);
  }

  @GetMapping("/portfolio")
  List<PortfolioProject> portfolio() { return projects.findAll(); }

  @PostMapping("/portfolio")
  PortfolioProject saveProject(@RequestBody PortfolioProject project) { return projects.save(project); }

  @DeleteMapping("/portfolio/{id}")
  void deleteProject(@PathVariable Long id) { projects.deleteById(id); }

  @GetMapping("/availability")
  List<Availability> availability() { return availability.findAll(); }

  @PostMapping("/availability")
  Availability saveAvailability(@RequestBody Availability slot) { return availability.save(slot); }

  @DeleteMapping("/availability/{id}")
  void deleteAvailability(@PathVariable Long id) { availability.deleteById(id); }

  @GetMapping("/clients")
  List<Client> clients() { return clients.findAll(); }

  @GetMapping("/testimonials")
  List<Testimonial> testimonials() { return testimonials.findAll(); }

  @PostMapping("/testimonials")
  Testimonial saveTestimonial(@RequestBody Testimonial testimonial) { return testimonials.save(testimonial); }

  @DeleteMapping("/testimonials/{id}")
  void deleteTestimonial(@PathVariable Long id) { testimonials.deleteById(id); }
}
