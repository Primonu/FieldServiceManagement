package com.fieldManagementService.DTO;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SiteResponseDTO {
	private Long id;
	private String siteName;
	private String appartmentName;
	private String floorNo;
	private String addressDetails;
	private String city;
	private String State;
	private String country;
	private Long zipCode;
	
	private CustomerResponseDTO customer;
	private List<WorkOrderDTO> workOrders;

}
