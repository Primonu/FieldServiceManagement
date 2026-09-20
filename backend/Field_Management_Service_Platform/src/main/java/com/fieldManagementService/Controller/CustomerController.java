package com.fieldManagementService.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fieldManagementService.DTO.CustomerDashboardDTO;
import com.fieldManagementService.DTO.CustomerRequestDTO;
import com.fieldManagementService.DTO.CustomerResponseDTO;
import com.fieldManagementService.DTO.StatusTimelineDTO;
import com.fieldManagementService.DTO.WorkOrderResponseDTO;
import com.fieldManagementService.Entity.Customer;
import com.fieldManagementService.Entity.Site;
import com.fieldManagementService.Entity.WorkOrder;
import com.fieldManagementService.Service.CustomerServiceImpl;
import com.fieldManagementService.Service.WorkOrderServiceImp;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerController {
	
	@Autowired
	private CustomerServiceImpl customerService;
	@Autowired
	private WorkOrderServiceImp workOrderService;
	
    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_CUSTOMER')")
	public ResponseEntity<Customer>createCustomer(@RequestBody Customer customer){
		return ResponseEntity.ok(customerService.createCustomer(customer));
	}
    @PutMapping("/{email}")
    @PreAuthorize("hasAuthority('UPDATE_CUSTOMER')")
    public ResponseEntity<Customer>updateCustomer(@PathVariable String email,@RequestBody Customer customer){
    	return ResponseEntity.ok(customerService.updateCustomer(email, customer));
    }
    @GetMapping("/id/{id}")
    @PreAuthorize("hasAuthority('VIEW_CUSTOMER')")
    public ResponseEntity<Customer>getCustomerById(@PathVariable Long id){
    	return ResponseEntity.ok(customerService.getCustomer(id));
    }
    @GetMapping("/email/{email}")
    @PreAuthorize("hasAuthority('VIEW_CUSTOMER')")
    public ResponseEntity<Customer>getCustomerByEmail(@PathVariable String email){
    	return ResponseEntity.ok(customerService.getCustomerByEmail(email));
    }
//    @GetMapping("/all")
//    @PreAuthorize("hasAuthority('VIEW_CUSTOMER')")
//    public ResponseEntity<List<CustomerResponseDTO>>getAllCustomer(){
//    	return ResponseEntity.ok(customerService.getAllCustomer());
//    }
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('VIEW_CUSTOMER')")
    public ResponseEntity<List<CustomerResponseDTO>>getAllCustomerOnly(){
    	return ResponseEntity.ok(customerService.getAllCustomersOnly());
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE_CUSTOMER')")
    public ResponseEntity<String>deleteCustomer(@PathVariable Long id){
    	customerService.deleteCustomer(id);
    	return ResponseEntity.ok("Customer Deleted Successfully");
    }
    @PostMapping("/raise-request")
    @PreAuthorize("hasAuthority('RAISE_REQUEST')")
    public ResponseEntity<WorkOrderResponseDTO>raiseRequest(@RequestBody CustomerRequestDTO request,Authentication authentication){
    	WorkOrder workOrder = new WorkOrder();
    	Customer customer = new Customer();
    	customer.setId(request.getCustomerId());
    	Site site = new Site();
    	site.setId(request.getSiteId());
    	workOrder.setCustomer(customer);
    	workOrder.setSite(site);
    	workOrder.setTitle(request.getTitle());
    	workOrder.setDescription(request.getDescription());
    	workOrder.setPriority(request.getPriority());
    	
    	WorkOrder saved = workOrderService.raiseRequest(workOrder,authentication);
    	
    	WorkOrderResponseDTO response = new WorkOrderResponseDTO();
    	response.setId(saved.getId());
    	response.setWorkCode(saved.getWorkCode());
    	response.setTitle(saved.getTitle());
    	response.setDescription(saved.getDescription());
        response.setPriority(saved.getPriority().name());
        response.setStatus(saved.getStatus().name());
        response.setSlaDueAt(saved.getSlaDueAt());

        response.setCustomerId(saved.getCustomer().getId());
        response.setCompanyName(saved.getCustomer().getCompanyName());

        response.setSiteId(saved.getSite().getId());
        response.setSiteName(saved.getSite().getSiteName());

        response.setAssignedTechnicianId(
                saved.getAssignedTechnician() != null
                        ? saved.getAssignedTechnician().getId()
                        : null
        );

        response.setStartedAt(saved.getStartedAt());
        response.setCompletedAt(saved.getCompletedAt());
        response.setClosedAt(saved.getClosedAt());
    	return ResponseEntity.ok(response);
    }
    @GetMapping("/view-request")
    @PreAuthorize("hasAuthority('VIEW_OWN_REQUEST')")
    public ResponseEntity<List<WorkOrderResponseDTO>> viewRequest(Authentication authentication){
    	List<WorkOrderResponseDTO> request = workOrderService.viewOwnRequest(authentication);
    	return ResponseEntity.ok(request);
    }
    @GetMapping("/dashboard")
    public ResponseEntity<CustomerDashboardDTO> getDashboard(Authentication authentication){
    	return ResponseEntity.ok(workOrderService.getCustomerDashboard(authentication));
    }
    
//    @GetMapping("/{id}")
//    public ResponseEntity<WorkOrderResponseDTO> getById(@PathVariable Long id) {
//
//        WorkOrder workOrder = workOrderService.getById(id);
//        WorkOrderResponseDTO dto = new WorkOrderResponseDTO();
//
//        dto.setId(workOrder.getId());
//        dto.setWorkCode(workOrder.getWorkCode());
//        dto.setTitle(workOrder.getTitle());
//        dto.setDescription(workOrder.getDescription());
//
//        if (workOrder.getPriority() != null) {
//            dto.setPriority(workOrder.getPriority().name());
//        }
//
//        if (workOrder.getStatus() != null) {
//            dto.setStatus(workOrder.getStatus().name());
//        }
//
//        dto.setSlaDueAt(workOrder.getSlaDueAt());
//
//        if (workOrder.getCustomer() != null) {
//            dto.setCustomerId(workOrder.getCustomer().getId());
//            dto.setCompanyName(
//                workOrder.getCustomer().getCompanyName()
//            );
//        }
//
//        if (workOrder.getSite() != null) {
//            dto.setSiteId(workOrder.getSite().getId());
//            dto.setSiteName(
//                workOrder.getSite().getSiteName()
//            );
//            dto.setCountry(workOrder.getSite().getCountry());
//        }
//
//        if (workOrder.getAssignedTechnician() != null) {
//            dto.setAssignedTechnicianId(
//                workOrder.getAssignedTechnician().getId()
//            );
//        }
//        if (workOrder.getStatusHistory() != null) {
//
//            List<StatusTimelineDTO> history =
//                workOrder.getStatusHistory()
//                    .stream()
//                    .map(h -> {
//                        String author = "Unknown";
//
//                        if (h.getChangedBy() != null) {
//                            author = h.getChangedBy().getFname()
//                                    + " "
//                                    + h.getChangedBy().getLname();
//                        }
//                        String title;
//
//                        if (h.getFromStatus() == null) {
//                            title = "Request Created";
//                        } else {
//                            title = h.getToStatus().name();
//                        }
//                        return new StatusTimelineDTO(
//                            h.getChangedAt(),
//                            title,
//                            author,
//                            h.getNote()
//                        );
//                    })
//                    .toList();
//
//            dto.setHistory(history);
//        }
//        
//        dto.setStartedAt(workOrder.getStartedAt());
//        dto.setCompletedAt(workOrder.getCompletedAt());
//        dto.setClosedAt(workOrder.getClosedAt());
//        dto.setTotalPartsCost(workOrder.getTotalPartsCost());
//        dto.setCreatedOn(workOrder.getCreatedOn());
//
//        return ResponseEntity.ok(dto);
//    }
    @GetMapping("/{id}")
    public ResponseEntity<WorkOrderResponseDTO> getById(@PathVariable Long id) {
    	return ResponseEntity.ok(workOrderService.getByIdAsDTO(id));
    }
}
