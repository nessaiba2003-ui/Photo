package com.studio.lenscraft.config;

import com.studio.lenscraft.model.*;
import com.studio.lenscraft.repository.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.util.StringUtils;
import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {
  @Bean
  CommandLineRunner seed(AdminUserRepository admins, PhotographyServiceRepository services, PortfolioProjectRepository projects, TestimonialRepository testimonials, PasswordEncoder encoder, @Value("${ADMIN_EMAIL:hamzaelbahi.orion@gmail.com}") String email, @Value("${ADMIN_BOOTSTRAP_PASSWORD:}") String bootstrapPassword) {
    return args -> {
      if (admins.count() == 0) {
        if (!StringUtils.hasText(bootstrapPassword)) {
          throw new IllegalStateException("ADMIN_BOOTSTRAP_PASSWORD must be configured as a server-side secret before the first admin account can be created.");
        }
        AdminUser admin = new AdminUser();
        admin.setEmail(email);
        admin.setPasswordHash(encoder.encode(bootstrapPassword));
        admins.save(admin);
      }
      if (services.count() == 0) {
        PhotographyService wedding = service("Wedding Film & Photo", "Photo & Film de Mariage", "Cinematic wedding storytelling with editorial portraits, candid moments, and a polished highlight film.", "Storytelling de mariage cinematographique avec portraits editoriaux, moments naturels et film highlight soigne.");
        wedding.getPackages().add(pkg(wedding, "Intimate Ceremony", "Ceremonie Intime", "Ceremony coverage, couple portraits, edited online gallery, 3-5 minute highlight film", "Couverture ceremonie, portraits couple, galerie en ligne retouchee, film highlight de 3 a 5 minutes", "4 hours", "4 heures", 180, "5000.00"));
        wedding.getPackages().add(pkg(wedding, "Signature Wedding", "Mariage Signature", "Full-day photo and video coverage, teaser reel, private gallery, 8-12 minute cinematic film", "Couverture photo et video journee complete, teaser reel, galerie privee, film cinematographique de 8 a 12 minutes", "8 hours", "8 heures", 450, "9500.00"));
        wedding.getPackages().add(pkg(wedding, "ALBATROS Premium", "ALBATROS Premium", "Full wedding story, two-camera coverage, drone when permitted, teaser, cinematic film, luxury delivery gallery", "Histoire complete du mariage, deux cameras, drone si autorise, teaser, film cinematographique, galerie de livraison premium", "12 hours", "12 heures", 700, "16000.00"));

        PhotographyService portrait = service("Portrait Session", "Seance Portrait", "Editorial portraits for personal brands, artists, creators, and professional profiles.", "Portraits editoriaux pour marques personnelles, artistes, createurs et profils professionnels.");
        portrait.getPackages().add(pkg(portrait, "Essential Portrait", "Portrait Essentiel", "One location, guided posing, color correction, retouched selects", "Un lieu, direction de pose, correction couleur, selections retouchees", "1 hour", "1 heure", 12, "700.00"));
        portrait.getPackages().add(pkg(portrait, "Editorial Portrait", "Portrait Editorial", "Two looks, creative direction, advanced retouching, social-ready crops", "Deux looks, direction creative, retouche avancee, formats prets pour les reseaux sociaux", "2 hours", "2 heures", 25, "1500.00"));

        PhotographyService events = service("Events Coverage", "Couverture Evenements", "Elegant photo and video coverage for private events, sport, performances, launches, and corporate moments.", "Couverture photo et video elegante pour evenements prives, sport, performances, lancements et moments corporate.");
        events.getPackages().add(pkg(events, "Event Photo", "Photo Evenement", "Event photography, curated gallery, color grading, fast online delivery", "Photographie evenementielle, galerie triee, colorimetrie, livraison rapide en ligne", "3 hours", "3 heures", 150, "2500.00"));
        events.getPackages().add(pkg(events, "Event Photo + Film", "Photo + Film Evenement", "Photo coverage, highlight video, vertical recap reel, private delivery link", "Couverture photo, video highlight, reel vertical recap, lien prive de livraison", "4 hours", "4 heures", 220, "5500.00"));

        PhotographyService content = service("Social Content Studio", "Studio Contenu Social", "High-impact photo and short-form video sessions built for Instagram, TikTok, launches, and personal brands.", "Sessions photo et videos courtes a fort impact pour Instagram, TikTok, lancements et marques personnelles.");
        content.getPackages().add(pkg(content, "Creator Half Day", "Demi-journee Createur", "Shot list planning, vertical video capture, 6 edited reels, 45 edited photos", "Preparation shot list, capture verticale, 6 reels montes, 45 photos retouchees", "4 hours", "4 heures", 51, "4500.00"));
        content.getPackages().add(pkg(content, "Launch Content Day", "Journee Lancement", "Campaign planning, product/lifestyle capture, 10 reels, 80 photos, delivery calendar", "Planning campagne, capture produit/lifestyle, 10 reels, 80 photos, calendrier de livraison", "6 hours", "6 heures", 90, "7500.00"));

        PhotographyService commercial = service("Commercial Brand Visuals", "Visuels de Marque Commerciale", "Premium photo, film, and visual communication packages for brands, venues, and campaigns.", "Formules premium photo, film et communication visuelle pour marques, lieux et campagnes.");
        commercial.getPackages().add(pkg(commercial, "Brand Starter", "Depart de Marque", "Creative direction, half-day shoot, edited brand gallery, one hero reel", "Direction creative, demi-journee de shooting, galerie de marque retouchee, un reel hero", "5 hours", "5 heures", 61, "6500.00"));
        commercial.getPackages().add(pkg(commercial, "Campaign Film + Photo", "Campagne Film + Photo", "Full-day production, photo library, campaign film, social cutdowns, usage-ready delivery", "Production journee complete, banque photo, film de campagne, formats sociaux, livraison prete a l usage", "8 hours", "8 heures", 110, "12000.00"));

        services.save(wedding);
        services.save(portrait);
        services.save(events);
        services.save(content);
        services.save(commercial);
      }
      if (projects.count() == 0) {
        projects.save(project("Between Earth & Sky", "Entre Terre et Ciel", "Open horizons, last light, and night skies with a cinematic sense of scale.", "Horizons ouverts, derniere lumiere et ciels nocturnes avec une echelle cinematographique.", "Photography", true, "/assets/portfolio-clean/photography-quiet-horizon.jpeg"));
        projects.save(project("Traditional Vows", "Promesses Traditionnelles", "Moroccan wedding portraits with ceremonial elegance, color, and intimate couple direction.", "Portraits de mariage marocain avec elegance ceremonielle, couleur et direction intime du couple.", "Weddings", true, "/assets/portfolio-clean/wedding-traditional-couple-1.jpg"));
        projects.save(project("Ceremony in Gold", "Ceremonie en Or", "A refined couple story shaped around traditional dress, gestures, and editorial light.", "Une histoire de couple raffinee autour de la tenue traditionnelle, des gestes et de la lumiere editoriale.", "Weddings", true, "/assets/portfolio-clean/wedding-traditional-couple-2.jpg"));
        projects.save(project("Cosmic Frames", "Cadres Cosmiques", "Moon textures, distant light, and quiet celestial compositions.", "Textures lunaires, lumiere lointaine et compositions celestes calmes.", "Photography", true, "/assets/portfolio-clean/photography-lunar-texture.jpeg"));
        projects.save(project("Cosmic Abstraction", "Abstraction Cosmique", "A short abstract motion piece shaped for atmosphere, rhythm, and screen impact.", "Une courte piece abstraite en mouvement travaillee pour l atmosphere, le rythme et l impact ecran.", "Video Editing", true, "/assets/portfolio-clean/photography-distant-light.jpeg"));
        projects.save(project("Celebration Pulse", "Pulse de Celebration", "Traditional celebration coverage focused on movement, expression, and social energy.", "Couverture de celebration traditionnelle axee sur le mouvement, l expression et l energie sociale.", "Events", true, "/assets/portfolio-clean/events-traditional-moment.jpg"));
        projects.save(project("Gathered Stories", "Histoires Rassemblees", "Guest moments and ceremonial atmosphere captured with clarity and discretion.", "Moments d invites et atmosphere ceremonielle captes avec clarte et discretion.", "Events", true, "/assets/portfolio-clean/events-traditional-guests.jpg"));
        projects.save(project("Motion in Silence", "Mouvement en Silence", "Live movement, performance, sport, and field moments captured with energy and restraint.", "Mouvement live, performance, sport et moments de terrain captures avec energie et retenue.", "Events", true, "/assets/portfolio-clean/events-fire-performance.jpg"));
        projects.save(project("Stillness Portraits", "Portraits de Silence", "Minimal portrait work built around expression, shadow, and presence.", "Portraits minimalistes construits autour de l expression, de l ombre et de la presence.", "Portraits", true, "/assets/portfolio-clean/portrait-stillness.jpg"));
        projects.save(project("Traditional Queen", "Reine Traditionnelle", "A strong Moroccan portrait with ceremonial styling and a quiet cinematic gaze.", "Un portrait marocain fort avec styling ceremoniel et regard cinematographique calme.", "Portraits", true, "/assets/portfolio-clean/portrait-traditional-queen.jpg"));
        projects.save(project("Gold Detail Portrait", "Portrait Detail Or", "Close portrait work highlighting texture, jewelry, and controlled editorial framing.", "Portrait rapproche mettant en valeur la texture, les bijoux et un cadrage editorial maitrise.", "Portraits", true, "/assets/portfolio-clean/portrait-traditional-gold.jpg"));
        projects.save(project("Black Fabric Study", "Etude en Tissu Noir", "A moody portrait study using fabric, expression, and sculpted contrast.", "Une etude portrait sombre avec tissu, expression et contraste sculpte.", "Portraits", true, "/assets/portfolio-clean/portrait-traditional-black.jpg"));
        projects.save(project("Find the Light", "Trouver la Lumiere", "A stylized portrait study balancing mystery, contrast, and soft light.", "Une etude portrait stylisee entre mystere, contraste et lumiere douce.", "Portraits", true, "/assets/portfolio-clean/portrait-find-the-light.jpg"));
        projects.save(project("ALBATROS Brand System", "Systeme de Marque ALBATROS", "Brand imagery and visual direction for a premium photo, film, and communication identity.", "Images de marque et direction visuelle pour une identite premium photo, film et communication.", "Commercial", true, "/assets/portfolio-clean/commercial-albatros-brand-system.jpeg"));
        projects.save(project("Traditional Detail", "Detail Traditionnel", "Detail-focused visual material for cultural styling, craft, and brand storytelling.", "Matiere visuelle axee sur le detail pour le styling culturel, l artisanat et le storytelling de marque.", "Commercial", true, "/assets/portfolio-clean/commercial-traditional-detail.jpg"));
        projects.save(project("Visuals That Move", "Des Visuels Qui Bougent", "Cinematic brand visuals prepared for high-impact Instagram presentation.", "Visuels de marque cinematographiques prepares pour une presentation Instagram impactante.", "Social Media Content", true, "/assets/hamza-albatros.jpeg"));
        projects.save(project("Reel Cover Energy", "Energie Cover Reel", "A social-first frame prepared for carousel covers, reels, and campaign announcements.", "Une image pensee pour les reseaux sociaux, couvertures de reels, carrousels et annonces de campagne.", "Social Media Content", true, "/assets/portfolio-clean/social-traditional-reel-cover.jpg"));
        projects.save(project("Cosmic Motion", "Mouvement Cosmique", "Atmospheric moving image work for poetic, visual-first storytelling.", "Image en mouvement atmospherique pour un storytelling poetique et visuel.", "Videography", true, "/assets/portfolio-clean/photography-under-stars.jpg"));
      }
      if (testimonials.count() == 0) {
        Testimonial t = new Testimonial();
        t.setClientName("Maya R.");
        t.setProjectOrService("Wedding Film");
        t.setProjectOrServiceFr("Film de mariage");
        t.setReview("The final film felt like memory, not just coverage. Every detail was intentional.");
        t.setReviewFr("Le film final ressemblait a un souvenir vivant, pas seulement a une couverture. Chaque detail etait intentionnel.");
        testimonials.save(t);
      }
    };
  }

  private PhotographyService service(String name, String nameFr, String description, String descriptionFr) {
    PhotographyService service = new PhotographyService();
    service.setName(name);
    service.setNameFr(nameFr);
    service.setDescription(description);
    service.setDescriptionFr(descriptionFr);
    return service;
  }

  private ServicePackage pkg(PhotographyService service, String name, String nameFr, String includes, String includesFr, String duration, String durationFr, int editedAssets, String price) {
    ServicePackage p = new ServicePackage();
    p.setService(service);
    p.setName(name);
    p.setNameFr(nameFr);
    p.setIncludes(includes);
    p.setIncludesFr(includesFr);
    p.setDuration(duration);
    p.setDurationFr(durationFr);
    p.setEditedAssets(editedAssets);
    p.setPrice(new BigDecimal(price));
    return p;
  }

  private PortfolioProject project(String title, String titleFr, String description, String descriptionFr, String category, boolean featured, String image) {
    PortfolioProject p = new PortfolioProject();
    p.setTitle(title);
    p.setTitleFr(titleFr);
    p.setDescription(description);
    p.setDescriptionFr(descriptionFr);
    p.setCategory(category);
    p.setFeatured(featured);
    p.setLocation("Rabat");
    p.setProjectDate(LocalDate.now().minusMonths(2));
    p.setCoverImageUrl(image);
    return p;
  }
}
