package com.fieldManagementService.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fieldManagementService.DTO.CustomerResponseDTO;
import com.fieldManagementService.DTO.SiteResponseDTO;
import com.fieldManagementService.DTO.WorkOrderDTO;
import com.fieldManagementService.Entity.Customer;
import com.fieldManagementService.Entity.Site;
import com.fieldManagementService.Repository.CustomerRepository;
import com.fieldManagementService.Repository.SiteRepository;
@Service
public class SiteServiceImpl implements SiteService {

	@Autowired
	private SiteRepository siteRepo;
	@Autowired 
	private CustomerRepository customerRepo;
	
	@Override
	public Site createSite(Long customerId,Site site) {
		if(customerId == null) {
			throw new IllegalArgumentException("Customer Id is required to create a sites");
		}
		Customer customer = customerRepo.findById(customerId)
				.orElseThrow(()->new RuntimeException("Customer Not Found"));
		site.setCustomer(customer);
		return siteRepo.save(site);
	}

	@Override
	public Site updateSite(Long id, Site siteDetails) {
		Site existingsite = siteRepo.findById(id)
				.orElseThrow(()->new RuntimeException("Site not found"));
		existingsite.setSiteName(siteDetails.getSiteName());
		existingsite.setAppartmentName(siteDetails.getAppartmentName());
		existingsite.setFloorNo(siteDetails.getFloorNo());
		existingsite.setAddressDetails(siteDetails.getAddressDetails());
		existingsite.setCity(siteDetails.getCity());
		existingsite.setState(siteDetails.getState());
		existingsite.setCountry(siteDetails.getCountry());
		existingsite.setZipCode(siteDetails.getZipCode());
		
		if(siteDetails.getCustomer()!=null && siteDetails.getCustomer().getId()!=null) {
			Customer customer = customerRepo.findById(siteDetails.getCustomer().getId())
					.orElseThrow(()-> new RuntimeException("Customer not found"));
			existingsite.setCustomer(customer);
		}
		return siteRepo.save(existingsite);
	}

	@Override
	public Site getSite(Long id) {

		return siteRepo.findById(id).orElseThrow(()->new RuntimeException("Site not found"));
	}

	@Override
	public List<Site> getSiteByCustomer(Long customerId) {
		// TODO Auto-generated method stub
		return siteRepo.findByCustomerId(customerId);
	}
	@Override
	public List<SiteResponseDTO> getAllSites() {
		
		return siteRepo.findAll()
				.stream()
				.map(site -> {
					SiteResponseDTO dto = new SiteResponseDTO();
					dto.setId(site.getId());
					dto.setSiteName(site.getSiteName());
					dto.setAppartmentName(site.getAppartmentName());
					dto.setFloorNo(site.getFloorNo());
					dto.setAddressDetails(site.getAddressDetails());
					dto.setCity(site.getCity());
					dto.setState(site.getState());
					dto.setCountry(site.getCountry());
					dto.setZipCode(site.getZipCode());
					
					if(site.getCustomer() != null) {
						Customer customer = site.getCustomer();
						CustomerResponseDTO custDto = new CustomerResponseDTO();
						custDto.setId(customer.getId());
						custDto.setCompanyName(customer.getCompanyName());
						custDto.setContactPerson(customer.getContactPerson());
						custDto.setEmail(customer.getEmail());
						custDto.setPhone(customer.getPhone());
						custDto.setAddress(customer.getAddress());
						custDto.setActive(customer.isActive());
						dto.setCustomer(custDto);
					}
					List<WorkOrderDTO> workOrders = site.getWorkOrders()
							.stream()
							.map(workOrder -> new WorkOrderDTO(
									workOrder.getId(),
									workOrder.getWorkCode(),
									workOrder.getTitle(),
									workOrder.getStatus().name())).toList();
					dto.setWorkOrders(workOrders);
					
					return dto;
				}).toList();
	}

	@Override
	public void deleteSite(Long id) {
		siteRepo.delete(getSite(id));

	}

}
