package com.fieldManagementService.Entity;

import java.math.BigDecimal;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;

@Entity
@Table(name = "parts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Part {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false)
	private String name;
	@Column(nullable = false,unique = true)
	private String sku;
	@Column(nullable = false)
	private BigDecimal unitCost;
	@Min(0)
	@Column(nullable = false)
	private Integer stockQty;
	

}
