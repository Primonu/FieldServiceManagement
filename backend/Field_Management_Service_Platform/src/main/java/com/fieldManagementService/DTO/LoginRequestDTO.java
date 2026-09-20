package com.fieldManagementService.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequestDTO {
	
	public String userEmail;
	public String password;

}
