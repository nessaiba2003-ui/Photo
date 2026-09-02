package com.studio.lenscraft.service;

import com.studio.lenscraft.exception.ApiException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Set;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {
  private static final Set<String> ALLOWED = Set.of("image/jpeg", "image/png", "image/webp", "video/mp4", "video/quicktime");
  private final Path uploadDir;

  public FileStorageService(@Value("${UPLOAD_DIR:uploads}") String uploadDir) {
    this.uploadDir = Path.of(uploadDir).toAbsolutePath().normalize();
  }

  public String store(MultipartFile file) {
    if (file.isEmpty()) throw new ApiException(HttpStatus.BAD_REQUEST, "File is empty");
    if (!ALLOWED.contains(file.getContentType())) throw new ApiException(HttpStatus.BAD_REQUEST, "Unsupported file type");
    String extension = extension(file.getOriginalFilename());
    String filename = UUID.randomUUID() + extension;
    try {
      Files.createDirectories(uploadDir);
      file.transferTo(uploadDir.resolve(filename));
      return "/uploads/" + filename;
    } catch (IOException ex) {
      throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not store file");
    }
  }

  private String extension(String name) {
    if (name == null || !name.contains(".")) return "";
    return name.substring(name.lastIndexOf(".")).toLowerCase();
  }
}
