package com.studio.lenscraft.config;

import com.studio.lenscraft.model.*;
import com.studio.lenscraft.repository.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {
  @Bean
  CommandLineRunner seed(AdminUserRepository admins, PhotographyServiceRepository services, PortfolioProjectRepository projects, TestimonialRepository testimonials, PasswordEncoder encoder, @Value("${ADMIN_EMAIL:admin@orionpolaris.local}") String email, @Value("${ADMIN_PASSWORD:ChangeMe123!}") String password) {
    return args -> {
      if (admins.count() == 0) {
        AdminUser admin = new AdminUser();
        admin.setEmail(email);
        admin.setPasswordHash(encoder.encode(password));
        admins.save(admin);
      }
      if (services.count() == 0) {
        PhotographyService wedding = service("Wedding Film & Photo", "Cinematic wedding storytelling with editorial portraits, candid moments, and a polished highlight film.");
        wedding.getPackages().add(pkg(wedding, "Signature Wedding", "Consultation, full-day coverage, teaser reel, private gallery, cinematic highlight film", "8 hours", 450, "2200.00"));
        wedding.getPackages().add(pkg(wedding, "Intimate Ceremony", "Ceremony coverage, couple portraits, edited gallery, one social reel", "3 hours", 120, "750.00"));
        PhotographyService content = service("Social Content Studio", "High-impact photo and short-form video sessions built for Instagram, TikTok, launches, and personal brands.");
        content.getPackages().add(pkg(content, "Creator Day", "Shot list planning, vertical video capture, 12 edited reels, 40 photos", "4 hours", 52, "950.00"));
        services.save(wedding);
        services.save(content);
      }
      if (projects.count() == 0) {
        projects.save(project("Noir City Portraits", "Moody editorial portraits with strong contrast and film-inspired color.", "Portraits", true, "https://images.unsplash.com/photo-1492447166138-50c3889fccb1?auto=format&fit=crop&w=1600&q=80"));
        projects.save(project("Atlas Wedding Story", "A refined wedding film and photo gallery captured across warm architectural textures.", "Weddings", true, "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1600&q=80"));
        projects.save(project("Launch Reel System", "Commercial reels, stills, and edits designed for a premium hospitality launch.", "Commercial", true, "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=80"));
      }
      if (testimonials.count() == 0) {
        Testimonial t = new Testimonial();
        t.setClientName("Maya R.");
        t.setProjectOrService("Wedding Film");
        t.setReview("The final film felt like memory, not just coverage. Every detail was intentional.");
        testimonials.save(t);
      }
    };
  }

  private PhotographyService service(String name, String description) {
    PhotographyService service = new PhotographyService();
    service.setName(name);
    service.setDescription(description);
    return service;
  }

  private ServicePackage pkg(PhotographyService service, String name, String includes, String duration, int editedAssets, String price) {
    ServicePackage p = new ServicePackage();
    p.setService(service);
    p.setName(name);
    p.setIncludes(includes);
    p.setDuration(duration);
    p.setEditedAssets(editedAssets);
    p.setPrice(new BigDecimal(price));
    return p;
  }

  private PortfolioProject project(String title, String description, String category, boolean featured, String image) {
    PortfolioProject p = new PortfolioProject();
    p.setTitle(title);
    p.setDescription(description);
    p.setCategory(category);
    p.setFeatured(featured);
    p.setLocation("Rabat");
    p.setProjectDate(LocalDate.now().minusMonths(2));
    p.setCoverImageUrl(image);
    return p;
  }
}
