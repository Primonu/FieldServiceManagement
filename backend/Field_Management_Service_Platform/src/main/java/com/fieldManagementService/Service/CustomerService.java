package com.fieldManagementService.Service;

import java.util.List;

import com.fieldManagementService.DTO.CustomerResponseDTO;
import com.fieldManagementService.Entity.Customer;

public interface CustomerService {
	Customer createCustomer(Customer customer);
	Customer updateCustomer(String email,Customer customer);
	Customer getCustomer(Long id);
	Customer getCustomerByEmail(String email);
	List<CustomerResponseDTO>getAllCustomer();
	void deleteCustomer(Long id);

}
