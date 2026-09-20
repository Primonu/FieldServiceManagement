package com.fieldManagementService.DTO;

import com.fieldManagementService.Enum.Role;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequestDTO {
	public String fname;
	public String lname;
	public String userEmail;
	public String phone;
	public String password;
	public Role role;

}
