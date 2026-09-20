package com.fieldManagementService.Entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="customer")

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String companyName;
	@Column(nullable = false)
	private String contactPerson;
	@Column(nullable = false)
	private String email;
	@Column(nullable = false)
	private String phone;
	@Column(nullable=false)
	private String address;
	@Column(nullable = false)
	private boolean active = true;
	private LocalDateTime createdAt;
	@OneToMany(mappedBy="customer",cascade=CascadeType.ALL,orphanRemoval = true)
	@JsonManagedReference
    private List<Site>sites=new ArrayList<>();
	
	

}
