package com.fieldManagementService.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fieldManagementService.Entity.TimeLog;
import com.fieldManagementService.Service.TimeLogServiceImpl;

@RestController
@RequestMapping("/api/work-orders")
public class TimeLogController {
	@Autowired
	private TimeLogServiceImpl timeLogService;
	@PostMapping("/{workOrderId}/time-logs")
	@PreAuthorize("hasAuthority('LOG_TIME')")
	public ResponseEntity<TimeLog>logTime(@PathVariable Long workOrderId,
			                              @RequestParam Long technicianId,
			                              @RequestParam Integer minute,
			                              @RequestParam(required = false)String note){
		return ResponseEntity.ok(timeLogService.logTime(workOrderId, technicianId, minute, note));
	}

}
