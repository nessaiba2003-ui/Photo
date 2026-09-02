package com.studio.lenscraft.repository;

import com.studio.lenscraft.model.ClientGallery;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientGalleryRepository extends JpaRepository<ClientGallery, Long> {
  Optional<ClientGallery> findByAccessToken(String accessToken);
}
