package com.fieldManagementService.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fieldManagementService.Entity.PartUsage;

@Repository
public interface PartUsageRepository extends JpaRepository<PartUsage, Long> {
	List<PartUsage>findByWorkOrderId(Long workOrderId);

}
