package com.fieldManagementService.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fieldManagementService.DTO.EmailLogDTO;
import com.fieldManagementService.Security.EmailLogService;

@RestController
@RequestMapping("/api/email_log")
public class EmailLogController {

	@Autowired
	private EmailLogService emailService;
	
	@PostMapping("/resetPasswordEmail")
	public ResponseEntity<String>sendResetPasswordEmail(@RequestParam String to,@PathVariable String token){
		String result = emailService.sendResetPasswordEmail(to, token);
		return ResponseEntity.ok(result);
	}
	
	@PostMapping("/notify")
	public ResponseEntity<String>notification(@RequestBody EmailLogDTO emailLog){
		String result = emailService.notify(emailLog);
		return ResponseEntity.ok(result);
	}
	
}
