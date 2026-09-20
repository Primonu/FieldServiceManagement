package com.fieldManagementService.DTO;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartUsageDTO {
	private Long id;
	private Long partId;
	private String partName;
	private String sku;
	private BigDecimal unitCost;
	private Integer quantity;
	private BigDecimal totalCost;

}
