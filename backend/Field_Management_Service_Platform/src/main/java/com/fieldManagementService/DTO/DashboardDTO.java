package com.fieldManagementService.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
	private long totalWorkOrders;
	private long newWorkOrders;
	private long assignedWorkOrders;
	private long inProgressWorkOrders;
	private long onHoldWorkOrders;
	private long completedWorkOrders;
	private long cancelledWorkOrders;

}
