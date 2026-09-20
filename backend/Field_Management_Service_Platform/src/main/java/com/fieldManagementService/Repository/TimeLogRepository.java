package com.fieldManagementService.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fieldManagementService.Entity.TimeLog;

@Repository
public interface TimeLogRepository extends JpaRepository<TimeLog, Long> {
	List<TimeLog>findByWorkOrderId(Long workOrderId);
	List<TimeLog>findByTechnicianId(Long technicianId);
	long countByWorkOrderId(Long workOrderid);

}
