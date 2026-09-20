package com.fieldManagementService.Service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;

import com.fieldManagementService.DTO.CustomerDashboardDTO;
import com.fieldManagementService.DTO.WorkOrderResponseDTO;
import com.fieldManagementService.Entity.WorkOrder;
import com.fieldManagementService.Enum.WorkOrderStatus;

public interface WorkOrderService {
	WorkOrder create(WorkOrder workOrder,Authentication authentication);
	WorkOrder raiseRequest(WorkOrder workOrder,Authentication authentication);
	WorkOrder getById(Long id);
	Page<WorkOrderResponseDTO>getAll(Pageable pageable);
	WorkOrder update(Long id,WorkOrder request);
	WorkOrder assign(Long workOrderId,Long technicianId);
	WorkOrder changeStatus(Long workOrderId,WorkOrderStatus newStatus,Long userId,String note);
	Page<WorkOrderResponseDTO> getTechnicianOrders(Long technicianId,Pageable pageable);
	Page<WorkOrder>getCustomerOrders(Long customerId,Pageable pageable);
	CustomerDashboardDTO getCustomerDashboard(Authentication authentication);
	WorkOrderResponseDTO startWork(Long workOrderId, Authentication authentication);
	WorkOrderResponseDTO getByIdAsDTO(Long id);
	WorkOrderResponseDTO holdWork(Long workOrderId, Authentication authentication);
	WorkOrderResponseDTO resumeWork(Long workOrderId, Authentication authentication);
	WorkOrderResponseDTO completeWork(Long workOrderId, Authentication authentication);
//	WorkOrder cancel(Long id,String reason);
//	WorkOrder close(Long id);

}
