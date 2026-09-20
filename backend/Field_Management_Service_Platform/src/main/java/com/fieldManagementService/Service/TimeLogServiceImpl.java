package com.fieldManagementService.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fieldManagementService.Entity.TimeLog;
import com.fieldManagementService.Entity.User;
import com.fieldManagementService.Entity.WorkOrder;
import com.fieldManagementService.Enum.Role;
import com.fieldManagementService.Enum.WorkOrderStatus;
import com.fieldManagementService.Repository.TimeLogRepository;
import com.fieldManagementService.Repository.UserRepository;
import com.fieldManagementService.Repository.WorkOrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TimeLogServiceImpl implements TimeLogService {
	@Autowired
	private TimeLogRepository timeLogRepo;
	@Autowired
	private WorkOrderRepository workOrderRepo;
	@Autowired
	private UserRepository userRepo;

	@Override
	public TimeLog logTime(Long workOrderId, Long technicianId, Integer minute, String note) {
		if(minute == null || minute <= 0) {
			throw new IllegalArgumentException("Minutes must be greater than zero");
		}
		WorkOrder workOrder = workOrderRepo.findById(workOrderId)
				.orElseThrow(()-> new RuntimeException("Work order not found"));
		User technician = userRepo.findById(technicianId)
				.orElseThrow(()-> new RuntimeException("Technician not found"));
		
		if(technician.getRole() != Role.TECHNICIAN) {
			throw new SecurityException("Only technician can log this work order");
		}
		if(workOrder.getStatus() == WorkOrderStatus.CLOSED || workOrder.getStatus() == WorkOrderStatus.CANCELLED) {
			throw new RuntimeException("Cannot log time on closed/cancelled work order");
		}
		TimeLog timeLog = TimeLog.builder()
				.workOrder(workOrder)
				.technician(technician)
				.minutes(minute)
				.notes(note)
				.build();
		
		TimeLog saved = timeLogRepo.save(timeLog);
		workOrderRepo.save(workOrder);
		return saved;
	}

}
