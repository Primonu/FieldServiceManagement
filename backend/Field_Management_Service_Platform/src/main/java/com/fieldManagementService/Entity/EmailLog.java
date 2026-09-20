package com.fieldManagementService.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name="email_log")

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailLog {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String recepientEmail;
	private String subject;
	@Column(length=5000)
	private String body;
	private LocalDateTime sentAt = LocalDateTime.now();
	private boolean sentStatus;
	
    public EmailLog(String recepientEmail,String subject,String body) {
    	this.recepientEmail = recepientEmail;
    	this.subject = subject;
    	this.body = body;
    }

}
