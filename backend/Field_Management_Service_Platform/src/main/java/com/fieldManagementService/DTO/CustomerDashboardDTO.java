package com.fieldManagementService.DTO;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDashboardDTO {
	private long totalRequests;
	private long inProgress;
	private long completed;
	private long onHold;

}
