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
        wedding.getPackages().add(pkg(wedding, "Intimate Ceremony", "Ceremony coverage, couple portraits, edited online gallery, 3-5 minute highlight film", "4 hours", 180, "5000.00"));
        wedding.getPackages().add(pkg(wedding, "Signature Wedding", "Full-day photo and video coverage, teaser reel, private gallery, 8-12 minute cinematic film", "8 hours", 450, "9500.00"));
        wedding.getPackages().add(pkg(wedding, "ALBATROS Premium", "Full wedding story, two-camera coverage, drone when permitted, teaser, cinematic film, luxury delivery gallery", "12 hours", 700, "16000.00"));

        PhotographyService portrait = service("Portrait Session", "Editorial portraits for personal brands, artists, creators, and professional profiles.");
        portrait.getPackages().add(pkg(portrait, "Essential Portrait", "One location, guided posing, color correction, retouched selects", "1 hour", 12, "700.00"));
        portrait.getPackages().add(pkg(portrait, "Editorial Portrait", "Two looks, creative direction, advanced retouching, social-ready crops", "2 hours", 25, "1500.00"));

        PhotographyService events = service("Events Coverage", "Elegant photo and video coverage for private events, sport, performances, launches, and corporate moments.");
        events.getPackages().add(pkg(events, "Event Photo", "Event photography, curated gallery, color grading, fast online delivery", "3 hours", 150, "2500.00"));
        events.getPackages().add(pkg(events, "Event Photo + Film", "Photo coverage, highlight video, vertical recap reel, private delivery link", "4 hours", 220, "5500.00"));

        PhotographyService content = service("Social Content Studio", "High-impact photo and short-form video sessions built for Instagram, TikTok, launches, and personal brands.");
        content.getPackages().add(pkg(content, "Creator Half Day", "Shot list planning, vertical video capture, 6 edited reels, 45 edited photos", "4 hours", 51, "4500.00"));
        content.getPackages().add(pkg(content, "Launch Content Day", "Campaign planning, product/lifestyle capture, 10 reels, 80 photos, delivery calendar", "6 hours", 90, "7500.00"));

        PhotographyService commercial = service("Commercial Brand Visuals", "Premium photo, film, and visual communication packages for brands, venues, and campaigns.");
        commercial.getPackages().add(pkg(commercial, "Brand Starter", "Creative direction, half-day shoot, edited brand gallery, one hero reel", "5 hours", 61, "6500.00"));
        commercial.getPackages().add(pkg(commercial, "Campaign Film + Photo", "Full-day production, photo library, campaign film, social cutdowns, usage-ready delivery", "8 hours", 110, "12000.00"));

        services.save(wedding);
        services.save(portrait);
        services.save(events);
        services.save(content);
        services.save(commercial);
      }
      if (projects.count() == 0) {
        projects.save(project("Between Earth & Sky", "Open horizons, last light, and night skies with a cinematic sense of scale.", "Photography", true, "/assets/portfolio-clean/photography-quiet-horizon.jpeg"));
        projects.save(project("Cosmic Frames", "Moon textures, distant light, and quiet celestial compositions.", "Photography", true, "/assets/portfolio-clean/photography-lunar-texture.jpeg"));
        projects.save(project("Cosmic Abstraction", "A short abstract motion piece shaped for atmosphere, rhythm, and screen impact.", "Video Editing", true, "/assets/portfolio-clean/photography-distant-light.jpeg"));
        projects.save(project("Motion in Silence", "Live movement, performance, sport, and field moments captured with energy and restraint.", "Events", true, "/assets/portfolio-clean/events-fire-performance.jpg"));
        projects.save(project("Stillness Portraits", "Minimal portrait work built around expression, shadow, and presence.", "Portraits", true, "/assets/portfolio-clean/portrait-stillness.jpg"));
        projects.save(project("Find the Light", "A stylized portrait study balancing mystery, contrast, and soft light.", "Portraits", true, "/assets/portfolio-clean/portrait-find-the-light.jpg"));
        projects.save(project("ALBATROS Brand System", "Brand imagery and visual direction for a premium photo, film, and communication identity.", "Commercial", true, "/assets/portfolio-clean/commercial-albatros-brand-system.jpeg"));
        projects.save(project("Visuals That Move", "Cinematic brand visuals prepared for high-impact Instagram presentation.", "Social Media Content", true, "/assets/hamza-albatros.jpeg"));
        projects.save(project("Cosmic Motion", "Atmospheric moving image work for poetic, visual-first storytelling.", "Videography", true, "/assets/portfolio-clean/photography-under-stars.jpg"));
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
