package com.studio.lenscraft.repository;

import com.studio.lenscraft.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {}
