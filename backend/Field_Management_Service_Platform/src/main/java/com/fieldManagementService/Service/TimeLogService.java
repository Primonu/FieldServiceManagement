package com.fieldManagementService.Service;

import com.fieldManagementService.Entity.TimeLog;

public interface TimeLogService {
	TimeLog logTime(Long workOrderId,Long technicianId,Integer minute,String note);

}
