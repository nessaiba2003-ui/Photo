package com.studio.lenscraft.controller;

import com.studio.lenscraft.service.FileStorageService;
import java.util.Map;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/files")
public class FileController {
  private final FileStorageService storage;

  public FileController(FileStorageService storage) {
    this.storage = storage;
  }

  @PostMapping
  Map<String, String> upload(@RequestParam MultipartFile file) {
    return Map.of("url", storage.store(file));
  }
}
