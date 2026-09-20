package com.fieldManagementService.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.fieldManagementService.DTO.AuthResponseDTO;
import com.fieldManagementService.DTO.LoginRequestDTO;
import com.fieldManagementService.DTO.RegisterRequestDTO;
import com.fieldManagementService.DTO.ResetPasswordDTO;
import com.fieldManagementService.DTO.UserResponseDTO;
import com.fieldManagementService.Enum.Role;
import com.fieldManagementService.Service.UserAuthService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user_auth")
@RequiredArgsConstructor
public class UserAuthController {
	
	@Autowired
	private UserAuthService userAuthService;
	
	@PostMapping("/register")
	public ResponseEntity<String>register(@RequestBody RegisterRequestDTO regist){
		return ResponseEntity.ok(userAuthService.register(regist));
	}
	
	@PostMapping("/login")
	public ResponseEntity<AuthResponseDTO>login(@RequestBody LoginRequestDTO login){
		return ResponseEntity.ok(userAuthService.login(login));
	}
	
	@PostMapping("/forgetPassword/{userEmail}")
	public ResponseEntity<String>forgotPassword(@PathVariable String userEmail){
		userAuthService.forgotPassword(userEmail);
		return ResponseEntity.ok("reset mail sent on your Email");
	}
	@PostMapping("/resetPassword")
	public ResponseEntity<String>resetPassword(@RequestBody ResetPasswordDTO request){
		userAuthService.resetPassword(request.getToken(), request.getNewPassword());
		return ResponseEntity.ok("Password reset successfully");
	}
	@PostMapping("/loggedOut")
	public ResponseEntity<String>loggedOut(HttpServletRequest request){
		return ResponseEntity.ok(userAuthService.logout(request));
	}
    @GetMapping("/role")
    public ResponseEntity<List<UserResponseDTO>>getUserByRole(@RequestParam Role role){
    	return ResponseEntity.ok(userAuthService.getUserByRole(role));
    }
    @GetMapping
    @PreAuthorize("hasAuthority('VIEW_USER')")
    public ResponseEntity<List<UserResponseDTO>>getAllUsers(){
    	return ResponseEntity.ok(userAuthService.getAllUser());
    }

}
