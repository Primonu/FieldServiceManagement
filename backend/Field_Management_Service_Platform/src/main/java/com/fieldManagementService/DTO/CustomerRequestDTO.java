package com.fieldManagementService.DTO;

import com.fieldManagementService.Enum.Priority;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CustomerRequestDTO {
	
	private Long customerId;
	
	private Long siteId;

	private String title;
	
	private String description;
	
	private Priority priority;

}
