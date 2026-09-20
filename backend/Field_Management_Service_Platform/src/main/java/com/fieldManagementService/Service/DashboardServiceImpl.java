package com.fieldManagementService.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fieldManagementService.DTO.DashboardDTO;
import com.fieldManagementService.Enum.WorkOrderStatus;
import com.fieldManagementService.Repository.WorkOrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {
	@Autowired
	private WorkOrderRepository workOrderRepo;

	@Override
	public DashboardDTO getDashboard() {
		long total = workOrderRepo.count();
		long newOrders = workOrderRepo.countByStatus(WorkOrderStatus.NEW);
		long assigned = workOrderRepo.countByStatus(WorkOrderStatus.ASSIGNED);
		long inProgres = workOrderRepo.countByStatus(WorkOrderStatus.IN_PROGRESS);
		long onHold = workOrderRepo.countByStatus(WorkOrderStatus.ON_HOLD);
		long completed = workOrderRepo.countByStatus(WorkOrderStatus.COMPLETED);
		long cancelled = workOrderRepo.countByStatus(WorkOrderStatus.CANCELLED);
		
		return new DashboardDTO(
				total,newOrders,assigned,inProgres,onHold,completed,cancelled);
	}

}
