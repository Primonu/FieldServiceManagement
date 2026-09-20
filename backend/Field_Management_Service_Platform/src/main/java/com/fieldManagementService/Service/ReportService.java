package com.fieldManagementService.Service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fieldManagementService.Enum.WorkOrderStatus;
import com.fieldManagementService.Repository.WorkOrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportService {
	@Autowired
	private WorkOrderRepository workOrderRepo;
	public Map<String, Long>getStatusCounts(){
		Map<String,Long>result = new HashMap<>();
		for(WorkOrderStatus status : WorkOrderStatus.values()) {
			result.put(status.name(), workOrderRepo.countByStatus(status));
		}
		return result;
	}

}
