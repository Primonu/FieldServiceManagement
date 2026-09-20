package com.fieldManagementService.Controller;

import java.net.Authenticator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fieldManagementService.DTO.WorkOrderResponseDTO;
import com.fieldManagementService.Entity.User;
import com.fieldManagementService.Entity.WorkOrder;
import com.fieldManagementService.Enum.WorkOrderStatus;
import com.fieldManagementService.Repository.UserRepository;
import com.fieldManagementService.Service.WorkOrderServiceImp;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/work-orders")
@RequiredArgsConstructor
public class WorkOrderController {
	@Autowired
	private WorkOrderServiceImp workOrderService;
	@Autowired
	private UserRepository userRepo;
	@PostMapping()
	@PreAuthorize("hasAuthority('CREATE_WO')")
	public ResponseEntity<WorkOrder>createWork(@RequestBody WorkOrder workOrder,Authentication authentication){
		return ResponseEntity.ok(workOrderService.create(workOrder,authentication));
	}
	@GetMapping("/{id}")
	@PreAuthorize("hasAuthority('VIEW_WO')")
	public ResponseEntity<WorkOrder>getById(@PathVariable Long id){
		return ResponseEntity.ok(workOrderService.getById(id));
	}
//	@GetMapping
//	@PreAuthorize("hasAuthority('VIEW_WO')")
//	public ResponseEntity<Page<WorkOrder>>getAllWork(Pageable pageable){
//		return ResponseEntity.ok(workOrderService.getAll(pageable));
//	}
	@PutMapping("/{id}")
	@PreAuthorize("hasAuthority('UPDATE_WO')")
	public ResponseEntity<WorkOrder> updateWork(@PathVariable Long id,@RequestBody WorkOrder workOrder){
		return ResponseEntity.ok(workOrderService.update(id, workOrder));
	}
	@PostMapping("/{id}/assign")
	@PreAuthorize("hasAuthority('ASSIGN_WO')")
	public ResponseEntity<WorkOrder>assignWork(@PathVariable Long id,@RequestParam Long technicianId){
		return ResponseEntity.ok(workOrderService.assign(id, technicianId));
	}
	@PutMapping("/{workOrderId}/status")
	public ResponseEntity<WorkOrder>changeStatus(@PathVariable Long workOrderId,
			                                     @RequestParam WorkOrderStatus newStatus,
			                                     @RequestParam Long userId,
			                                     @RequestParam(required = false)String note){
		WorkOrder workOrder = workOrderService.changeStatus(workOrderId, newStatus, userId, note);
		
		return ResponseEntity.ok(workOrder);
	}
	
//	@GetMapping("/technician/{technicianId}")
//	@PreAuthorize("hasAuthority('VIEW_WO')")
//	public ResponseEntity<Page<WorkOrder>>getTechnicianOrders(@PathVariable Long technicianId,Pageable pageable){
//		Page<WorkOrder> orders = workOrderService.getTechnicianOrders(technicianId, pageable);
//		return ResponseEntity.ok(orders);
//	}
	@GetMapping("/customer/{customerId}")
	@PreAuthorize("hasAuthority('VIEW_WO')")
	public ResponseEntity<Page<WorkOrder>>getCustomerOrders(@PathVariable Long customerId,Pageable pageable){
		Page<WorkOrder> orders = workOrderService.getCustomerOrders(customerId, pageable);
		return ResponseEntity.ok(orders);
	}
	@GetMapping
	@PreAuthorize("hasAuthority('VIEW_WO')")
	public ResponseEntity<Page<WorkOrderResponseDTO>> viewWork(Pageable pageable){
		return ResponseEntity.ok(workOrderService.getAll(pageable));
	}
	@GetMapping("/code/{workCode}")
	@PreAuthorize("hasAuthority('VIEW_WO')")
	public ResponseEntity<WorkOrderResponseDTO> getByWorkCode(@PathVariable String workCode){
		WorkOrderResponseDTO dto = workOrderService.getByWorkCode(workCode);
		return ResponseEntity.ok(dto);
	
	}
	
	@PutMapping("/{id}/cancel")
	@PreAuthorize("hasAuthority('CANCEL_WO')")
	public ResponseEntity<WorkOrderResponseDTO> cancelWork(@PathVariable Long id, Authentication authentication){
		return ResponseEntity.ok(workOrderService.cancel(id, authentication));
	}
	
	@PutMapping("/{id}/start")
	@PreAuthorize("hasAuthority('START_WORK')")
	public ResponseEntity<WorkOrderResponseDTO> startWork(@PathVariable Long id,Authentication authentication){
		return ResponseEntity.ok(workOrderService.startWork(id, authentication));
	}
	@PutMapping("/{id}/hold")
	@PreAuthorize("hasAuthority('HOLD_WORK')")
	public ResponseEntity<WorkOrderResponseDTO> holdWork(@PathVariable Long id, Authentication authentication){
		return ResponseEntity.ok(workOrderService.holdWork(id, authentication));
	}
	@PutMapping("/{id}/resume")
	@PreAuthorize("hasAuthority('RESUME_WORK')")
	public ResponseEntity<WorkOrderResponseDTO> resumeWork(@PathVariable Long id, Authentication authentication){
		return ResponseEntity.ok(workOrderService.resumeWork(id, authentication));
	}
	@PutMapping("/{id}/complete")
	@PreAuthorize("hasAuthority('COMPLETED_WORK')")
	public ResponseEntity<WorkOrderResponseDTO> completeWork(@PathVariable Long id, Authentication authentication){
		return ResponseEntity.ok(workOrderService.completeWork(id, authentication));
	}
	
	@GetMapping("/technician/my-orders")
	@PreAuthorize("hasAuthority('VIEW_WO')")
	public ResponseEntity<Page<WorkOrderResponseDTO>> getMyWork(Authentication authentication,Pageable pageable){
		String email = authentication.getName();
		User technician = userRepo.findByUserEmail(email)
				.orElseThrow(() -> new RuntimeException("Technician not found"));
		Page<WorkOrderResponseDTO> orders = workOrderService.getTechnicianOrders(technician.getId(),pageable);
		return ResponseEntity.ok(orders);
	}

}
