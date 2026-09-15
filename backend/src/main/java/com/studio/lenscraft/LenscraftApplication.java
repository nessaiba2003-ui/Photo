package com.studio.lenscraft;

import java.net.URI;
import java.util.Map;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.MapPropertySource;

@SpringBootApplication
public class LenscraftApplication {
  public static void main(String[] args) {
    SpringApplication application = new SpringApplication(LenscraftApplication.class);
    String databaseUrl = System.getenv("DATABASE_URL");

    // Hosted PostgreSQL providers supply a URI with credentials, while JDBC receives them separately.
    if (databaseUrl != null && (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://"))) {
      URI uri = URI.create(databaseUrl);
      String jdbcUrl = "jdbc:postgresql://" + uri.getHost()
          + (uri.getPort() == -1 ? "" : ":" + uri.getPort())
          + uri.getPath()
          + (uri.getQuery() == null ? "" : "?" + uri.getQuery());
      application.addInitializers(context -> context.getEnvironment().getPropertySources().addFirst(
          new MapPropertySource("hostedJdbcUrl", Map.of("spring.datasource.url", jdbcUrl))));
    }

    application.run(args);
  }
}
