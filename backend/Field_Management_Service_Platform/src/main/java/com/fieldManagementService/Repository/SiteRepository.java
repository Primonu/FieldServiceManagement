package com.fieldManagementService.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fieldManagementService.Entity.Site;

@Repository
public interface SiteRepository extends JpaRepository<Site, Long> {
	List<Site>findByCustomerId(Long customerId);
	Page<Site>findByCustomerId(Long customerId,Pageable pageable);

}
