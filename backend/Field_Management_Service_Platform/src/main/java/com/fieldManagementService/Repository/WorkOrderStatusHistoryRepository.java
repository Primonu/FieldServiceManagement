package com.fieldManagementService.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fieldManagementService.Entity.WorkOrderStatusHistory;

@Repository
public interface WorkOrderStatusHistoryRepository extends JpaRepository<WorkOrderStatusHistory, Long> {

	List<WorkOrderStatusHistory>findByWorkOrderIdOrderByChangedAtAsc(Long workOrderId);
}
