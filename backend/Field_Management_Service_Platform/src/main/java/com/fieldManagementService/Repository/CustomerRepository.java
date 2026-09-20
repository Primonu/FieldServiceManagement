package com.fieldManagementService.Repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fieldManagementService.Entity.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long>{
	boolean existsByEmail(String email);
	Optional<Customer> findByEmail(String email);
	Page<Customer> findByCompanyName(String companName,Pageable pageable);

}
