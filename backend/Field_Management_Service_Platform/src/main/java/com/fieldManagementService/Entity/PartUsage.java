package com.fieldManagementService.Entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "part_usages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartUsage {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "work_order_id",nullable = false)
	private WorkOrder workOrder;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "part_id",nullable = false)
	private Part part;
	@Column(nullable = false)
	private Integer quantity;
	@Column(nullable = false)
	private BigDecimal unitCost;
	@Column(nullable = false)
	private BigDecimal totalCost;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "technician_id",nullable = false)
	private User technician;

}
