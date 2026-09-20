package com.fieldManagementService.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fieldManagementService.DTO.DashboardDTO;
import com.fieldManagementService.Service.DashboardServiceImpl;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
	@Autowired
	private DashboardServiceImpl dashboardService;
	
	@GetMapping
	@PreAuthorize("hasAuthority('VIEW_DASHBOARD')")
	public ResponseEntity<DashboardDTO> getDashboard(){
		return ResponseEntity.ok(dashboardService.getDashboard());
	}
	@GetMapping("/technician")
	public ResponseEntity<DashboardDTO> getTechnicianDashboard(){
		return ResponseEntity.ok(dashboardService.getDashboard());
	}

}
