package com.fieldManagementService.Entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fieldManagementService.Enum.Priority;
import com.fieldManagementService.Enum.WorkOrderStatus;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "work_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkOrder {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(name="WORK_CODE",nullable = false,unique = true)
	private String workCode;
	@Column(nullable = false)
	private String title;
	private String description;
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Priority priority;
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private WorkOrderStatus status;
	@Column(nullable = false)
	private LocalDateTime slaDueAt;
	@ManyToOne(fetch = FetchType.LAZY,optional = false)
	@JoinColumn(name = "customerId",nullable = false)
	private Customer customer;
	@ManyToOne(fetch = FetchType.LAZY,optional = false)
	@JoinColumn(name = "site_id",nullable = false)
	private Site site;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "assigned_technician_id")
	private User assignedTechnician;
	@Column
	private LocalDateTime startedAt;
	@Column
	private LocalDateTime completedAt;
	@Column
	private LocalDateTime closedAt;
	@Column(nullable = false, updatable = false)
	private LocalDateTime createdOn;
	@Column(nullable = false,precision = 12, scale = 2)
	private BigDecimal totalPartsCost = BigDecimal.ZERO;
	@OneToMany(mappedBy = "workOrder")
	@OrderBy("changedAt ASC")
	@ElementCollection
	private List<WorkOrderStatusHistory> statusHistory = new ArrayList<>();
	@OneToMany(mappedBy = "workOrder")
	@ElementCollection
	private List<PartUsage> partUsages = new ArrayList<>();
	@ElementCollection
	private List<TimeLog>timeLogs = new ArrayList<>();
	
	@PrePersist
	public void prePersist() {
		createdOn = LocalDateTime.now();
	}

}
