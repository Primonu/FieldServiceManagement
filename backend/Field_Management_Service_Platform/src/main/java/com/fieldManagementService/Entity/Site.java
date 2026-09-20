package com.fieldManagementService.Entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="sites")

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Site {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	private String siteName;
	private String appartmentName;
	private String floorNo;
	private String addressDetails;
	private String city;
	private String State;
	private String country;
	private Long zipCode;
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="customerId",nullable = false)
	@JsonBackReference
	private Customer customer;
	@OneToMany(mappedBy = "site")
	@JsonIgnore
	private List<WorkOrder> workOrders = new ArrayList<>();

}
