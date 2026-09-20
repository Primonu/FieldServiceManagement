package com.fieldManagementService.Repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fieldManagementService.Entity.Part;

import jakarta.persistence.LockModeType;

public interface PartRepository extends JpaRepository<Part, Long> {
	Optional<Part> findBySku(String sku);
	boolean existsBySku(String sku);
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("""
			SELECT p
			FROM Part p
			WHERE p.id = :id
			""")
	Optional<Part>findByIdForUpdate(@Param("id") Long id);
	Page<Part>findByName(String name,Pageable pageable);

}
