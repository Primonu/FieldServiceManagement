package com.fieldManagementService.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fieldManagementService.Service.ReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {
	@Autowired
	private ReportService reportService;
	
	@GetMapping("/summary")
	@PreAuthorize("hasAuthority('VIEW_REPORTS')")
	public ResponseEntity<Map<String,Long>>summary(){
		return ResponseEntity.ok(reportService.getStatusCounts());
	}

}
