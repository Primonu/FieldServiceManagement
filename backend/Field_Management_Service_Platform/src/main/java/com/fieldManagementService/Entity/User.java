package com.fieldManagementService.Entity;

import java.time.LocalDate;
import java.util.Date;

import com.fieldManagementService.Enum.Role;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="user_auth")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false)
	private String fname;
	@Column(nullable = false)
	private String lname;
	@Column(unique = true,nullable = false)
	private String userEmail;
	
	private String phone;
	@Column(nullable = false)
	private String password;
	@Enumerated(EnumType.STRING)
	private Role role;
	
	private String resetToken;
	private Date resetTokenExpiry;

}
