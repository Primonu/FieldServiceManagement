package com.fieldManagementService.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fieldManagementService.DTO.CustomerResponseDTO;
import com.fieldManagementService.DTO.SiteResponseDTO;
import com.fieldManagementService.DTO.WorkOrderResponseDTO;
import com.fieldManagementService.Entity.Customer;
import com.fieldManagementService.Entity.Site;
import com.fieldManagementService.Entity.WorkOrder;
import com.fieldManagementService.Repository.CustomerRepository;
import com.fieldManagementService.Repository.SiteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {
	@Autowired
	private CustomerRepository customerRepo;
	@Autowired
	private SiteRepository siteRepo;

	@Override
	public Customer createCustomer(Customer customer) {
		if(customerRepo.existsByEmail(customer.getEmail())) {
			throw new RuntimeException("Customer already exists");
		}
		customer.setActive(true);
		customer.setCreatedAt(LocalDateTime.now());
		return customerRepo.save(customer);
	}

	@Override
	public Customer updateCustomer(String email, Customer customer) {
		Customer existingCustomer = customerRepo.findByEmail(email)
				.orElseThrow(()->new RuntimeException("Customer not find"));
		existingCustomer.setCompanyName(customer.getCompanyName());
		existingCustomer.setContactPerson(customer.getContactPerson());
		existingCustomer.setPhone(customer.getPhone());
		existingCustomer.setAddress(customer.getAddress());
		existingCustomer.setActive(customer.isActive());
		return customerRepo.save(existingCustomer);
	}

	@Override
	public Customer getCustomer(Long id) {
		
		return customerRepo.findById(id)
				.orElseThrow(()-> new RuntimeException("Customer not found"));
	}

	@Override
	public Customer getCustomerByEmail(String email) {
		return customerRepo.findByEmail(email)
				.orElseThrow(()-> new RuntimeException("Customer not found"));
	}

	@Override
	public List<CustomerResponseDTO> getAllCustomer() {
		
		return siteRepo.findAll()
				.stream()
				.map(this::convertCustomerResponseDTO)
				.collect(Collectors.toList());
	}

	@Override
	public void deleteCustomer(Long id) {
		Customer customer = customerRepo.findById(id).orElseThrow(()->new RuntimeException("Customer not found"));
		customerRepo.delete(customer);

	}
	private CustomerResponseDTO convertCustomerResponseDTO(Site site) {
		CustomerResponseDTO dto = new CustomerResponseDTO();
		dto.setSiteId(site.getId());
		dto.setSiteName(site.getSiteName());
		dto.setCity(site.getCity());
		dto.setCountry(site.getCountry());
		
		if(site.getCustomer() != null) {
			dto.setId(site.getCustomer().getId());
			dto.setCompanyName(site.getCustomer().getCompanyName());
			dto.setContactPerson(site.getCustomer().getContactPerson());
			dto.setEmail(site.getCustomer().getEmail());
			dto.setPhone(site.getCustomer().getPhone());
			dto.setAddress(site.getCustomer().getAddress());
			dto.setActive(site.getCustomer().isActive());
		}
		return dto;
		
	}
	public List<CustomerResponseDTO> getAllCustomersOnly(){
		return customerRepo.findAll()
				.stream()
				.map(this::convertCustomerOnly)
				.collect(Collectors.toList());
	}
	private CustomerResponseDTO convertCustomerOnly(Customer customer) {
		CustomerResponseDTO dto = new CustomerResponseDTO();
		
		dto.setId(customer.getId());
		dto.setCompanyName(customer.getCompanyName());
		dto.setContactPerson(customer.getContactPerson());
		dto.setEmail(customer.getEmail());
		dto.setPhone(customer.getPhone());
		dto.setAddress(customer.getAddress());
		dto.setActive(customer.isActive());
		
		
		return dto;
	}

}
