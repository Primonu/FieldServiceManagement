package com.fieldManagementService.Entity;

import java.time.LocalDateTime;

import com.fieldManagementService.Enum.WorkOrderStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="work_order_status_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkOrderStatusHistory {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne(fetch = FetchType.LAZY,optional = false)
	@JoinColumn(name = "work_order_id",nullable = false)
	private WorkOrder workOrder;
	@Enumerated(EnumType.STRING)
	@Column(name = "from_status")
	private WorkOrderStatus fromStatus;
	@Enumerated(EnumType.STRING)
	@Column(name = "to_status",nullable=false)
	private WorkOrderStatus toStatus;
	@ManyToOne(fetch = FetchType.LAZY,optional = false)
	@JoinColumn(name = "changed_by",nullable = false)
	private User changedBy;
	@Column(nullable = false,updatable = false)
	private LocalDateTime changedAt;
	private String note;
	@PrePersist
	protected void onCreate() {
		changedAt = LocalDateTime.now();
	}

}
