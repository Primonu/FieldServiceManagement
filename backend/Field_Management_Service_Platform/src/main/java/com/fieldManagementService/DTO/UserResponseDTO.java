package com.fieldManagementService.DTO;

import com.fieldManagementService.Enum.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Builder
public class UserResponseDTO {
	public Long id;
	public String fname;
	public String lname;
	public String userEmail;
	public String phone;
	public String role;
	public UserResponseDTO(Long id,String fname, String lname, String userEmail, String phone, String role) {
		super();
		this.id = id;
		this.fname = fname;
		this.lname = lname;
		this.userEmail = userEmail;
		this.phone = phone;
		this.role = role;
	}
	
	

}
