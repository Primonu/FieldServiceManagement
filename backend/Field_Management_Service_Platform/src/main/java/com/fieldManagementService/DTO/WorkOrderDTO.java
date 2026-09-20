package com.fieldManagementService.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkOrderDTO {
	private Long id;
	private String workCode;
	private String title;
	private String status;

}
