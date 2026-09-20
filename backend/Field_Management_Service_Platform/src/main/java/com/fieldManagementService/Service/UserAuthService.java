package com.fieldManagementService.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fieldManagementService.DTO.AuthResponseDTO;
import com.fieldManagementService.DTO.LoginRequestDTO;
import com.fieldManagementService.DTO.RegisterRequestDTO;
import com.fieldManagementService.DTO.UserResponseDTO;
import com.fieldManagementService.Entity.User;
import com.fieldManagementService.Enum.Role;
import com.fieldManagementService.Repository.UserRepository;
import com.fieldManagementService.Security.EmailLogService;
import com.fieldManagementService.Security.JWTTokenUtil;
import com.fieldManagementService.Security.TokenBlockService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserAuthService {
	@Autowired
	private UserRepository userRepo;
	@Autowired
	private JWTTokenUtil jwtUtil;
	@Autowired
	private PasswordEncoder passwordEncode;
	@Autowired
	private EmailLogService emailLogService;
	@Autowired
	private TokenBlockService tokenBlockSevice;
	
	public String register(RegisterRequestDTO register) {
		Optional<User> existingUser = userRepo.findByUserEmail(register.userEmail);
		
		if(existingUser.isPresent()) {
			throw new RuntimeException("User already exist");
		}
		User user = new User();
		user.setFname(register.fname);
		user.setLname(register.lname);
		user.setUserEmail(register.userEmail);
		user.setPassword(passwordEncode.encode(register.password));
		user.setPhone(register.phone);
		user.setRole(register.role);
		
		userRepo.save(user);
		return "User Register Successfully";
	}

	public AuthResponseDTO login(LoginRequestDTO login) {
		User user = userRepo.findByUserEmail(login.userEmail)
				.orElseThrow(()-> new RuntimeException("User not found"));
		if(!passwordEncode.matches(login.password, user.getPassword())) {
			throw new RuntimeException("Invalid Password");
		}
		String token = jwtUtil.generateToken(user);
		UserResponseDTO userResponse = new UserResponseDTO(
				user.getId(),
				user.getFname(),
				user.getLname(),
				user.getUserEmail(),
				user.getPhone(),
				user.getRole().name());
		return new AuthResponseDTO(token, "Login Successfully",user.getRole().name(),userResponse);
	}
	
	public void forgotPassword(String userEmail) {
		User user = userRepo.findByUserEmail(userEmail)
				.orElseThrow(()-> new RuntimeException("User not found"));
		
		String token = UUID.randomUUID().toString();
		user.setResetToken(token);
		user.setResetTokenExpiry(new Date(System.currentTimeMillis()+10*60*1000));
		userRepo.save(user);
		
		emailLogService.sendResetPasswordEmail(userEmail, token);
	}
	
	public void resetPassword(String token,String newPassword) {
		User user = userRepo.findByResetToken(token)
				.orElseThrow(()-> new RuntimeException("invalid token"));
		if(user.getResetTokenExpiry().before(new Date())) {
			throw new RuntimeException("token expired");
		}
		user.setPassword(passwordEncode.encode(newPassword));
		user.setResetToken(null);
		user.setResetTokenExpiry(null);
		
		userRepo.save(user);
	}
	
	public String logout(HttpServletRequest request) {
		String header = request.getHeader("Authorization");
		String token = jwtUtil.extractToken(header);
		if(token != null) {
			tokenBlockSevice.blockListToken(token);
		}
		return "Logged out successfully";
	}
   public List<UserResponseDTO>getUserByRole(Role role){
	   List<User> users = userRepo.findByRole(role);
	   return users.stream()
			   .map(user -> new UserResponseDTO(
					   user.getId(),
					   user.getFname(),
					   user.getLname(),
					   user.getUserEmail(),
					   user.getPhone(),
					   user.getRole().name())).toList();
	   
   }
   public List<UserResponseDTO>getAllUser(){
	   List<User> user = userRepo.findAll();
	   return user.stream()
			   .map(users -> new UserResponseDTO(
					   users.getId(),
					   users.getFname(),
					   users.getLname(),
					   users.getUserEmail(),
					   users.getPhone(),
					   users.getRole().name())).toList();
   }
}
