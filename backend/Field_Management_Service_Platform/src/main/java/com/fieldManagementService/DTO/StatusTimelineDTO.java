package com.fieldManagementService.DTO;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusTimelineDTO {
	private LocalDateTime date;
	private String status;
	private String title;
	private String author;
	private String note;

}
