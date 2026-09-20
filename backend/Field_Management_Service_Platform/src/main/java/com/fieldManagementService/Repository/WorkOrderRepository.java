package com.fieldManagementService.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fieldManagementService.DTO.WorkOrderResponseDTO;
import com.fieldManagementService.Entity.WorkOrder;
import com.fieldManagementService.Enum.WorkOrderStatus;

@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {
	
	Optional<WorkOrder>findByWorkCode(String code);
	Page<WorkOrder> findByStatus(WorkOrderStatus status,Pageable pageable);
	Page<WorkOrder> findByAssignedTechnicianId(Long technicianId,Pageable pageable);
	Page<WorkOrder>findByCustomerId(Long customerId,Pageable pageable);
	List<WorkOrder>findByCustomer_Id(Long customerId);
	List<WorkOrder>findBySlaDueAtBeforeAndStatusNotIn(LocalDateTime time,List<WorkOrderStatus> statuses);
	@Query("""
			SELECT w FROM WorkOrder w 
			WHERE
			     LOWER(w.title) LIKE LOWER(CONCAT('%', :keyword,'%'))
			     OR LOWER(w.workCode) LIKE LOWER(CONCAT('%', :keyword,'%'))
			""")
	Page<WorkOrder>search(@Param("keyword") String keyword,Pageable pageable);
	long countByStatus(WorkOrderStatus status);
	long countByCustomer_Id(Long customerId);
	long countByCustomer_IdAndStatus(Long customerId,WorkOrderStatus status);

}
