package com.studio.lenscraft;

import java.util.Map;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.MapPropertySource;

@SpringBootApplication
public class LenscraftApplication {
  public static void main(String[] args) {
    SpringApplication application = new SpringApplication(LenscraftApplication.class);
    String databaseUrl = System.getenv("DATABASE_URL");

    // Render supplies a standard PostgreSQL URI, while Spring's JDBC driver needs a jdbc: URI.
    if (databaseUrl != null && (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://"))) {
      String jdbcUrl = databaseUrl.startsWith("postgres://")
          ? "jdbc:postgresql://" + databaseUrl.substring("postgres://".length())
          : "jdbc:" + databaseUrl;
      application.addInitializers(context -> context.getEnvironment().getPropertySources().addFirst(
          new MapPropertySource("renderJdbcUrl", Map.of("spring.datasource.url", jdbcUrl))));
    }

    application.run(args);
  }
}
