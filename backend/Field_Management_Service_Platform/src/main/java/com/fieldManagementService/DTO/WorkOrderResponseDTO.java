package com.fieldManagementService.DTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkOrderResponseDTO {
	private Long id;
	private String workCode;
	private String title;
	private String description;
	private String priority;
	private String status;
	private LocalDateTime slaDueAt;
	
	private Long customerId;
	private String companyName;
	private String contactPerson;
	private String email;
	private String phone;
	
	private Long siteId;
	private String siteName;
	private String city;
	private String country;
	private String appartmentName;
	private String floorNo;
	private String addressDetails;
	
	private Long assignedTechnicianId;
	private String assignTechnician;
	
	private LocalDateTime startedAt;
	private LocalDateTime completedAt;
	private LocalDateTime closedAt;
	private LocalDateTime createdOn;
	
	private List<PartUsageDTO> partUsages;
	private List<StatusTimelineDTO> history;

}
