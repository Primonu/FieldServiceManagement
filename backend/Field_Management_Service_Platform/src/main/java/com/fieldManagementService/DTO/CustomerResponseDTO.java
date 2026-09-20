package com.fieldManagementService.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResponseDTO {
	private Long id;
	private String companyName;
	private String contactPerson;
	private String email;
	private String phone;
	private String address;
	private boolean active;
	private Long siteId;
	private String siteName;
	private String city;
	private String country;
	

}
