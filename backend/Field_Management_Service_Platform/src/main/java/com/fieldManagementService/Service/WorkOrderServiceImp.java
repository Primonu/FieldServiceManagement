package com.fieldManagementService.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.fieldManagementService.DTO.CustomerDashboardDTO;
import com.fieldManagementService.DTO.PartUsageDTO;
import com.fieldManagementService.DTO.StatusTimelineDTO;
import com.fieldManagementService.DTO.WorkOrderResponseDTO;
import com.fieldManagementService.Entity.Customer;
import com.fieldManagementService.Entity.Site;
import com.fieldManagementService.Entity.User;
import com.fieldManagementService.Entity.WorkOrder;
import com.fieldManagementService.Entity.WorkOrderStatusHistory;
import com.fieldManagementService.Enum.Priority;
import com.fieldManagementService.Enum.Role;
import com.fieldManagementService.Enum.WorkOrderStatus;
import com.fieldManagementService.Repository.CustomerRepository;
import com.fieldManagementService.Repository.SiteRepository;
import com.fieldManagementService.Repository.UserRepository;
import com.fieldManagementService.Repository.WorkOrderRepository;
import com.fieldManagementService.Repository.WorkOrderStatusHistoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WorkOrderServiceImp implements WorkOrderService {
	@Autowired
	private WorkOrderRepository workOrderRepo;
	@Autowired
	private CustomerRepository customerRepo;
	@Autowired
	private SiteRepository siteRepo;
	@Autowired
	private UserRepository userRepo;
	@Autowired
	private WorkOrderStatusHistoryRepository historyRepo;

	@Override
	public WorkOrder create(WorkOrder workOrder,Authentication authenticaton) {
        if(workOrder.getCustomer() == null || workOrder.getCustomer().getId() == null) {
        	throw new RuntimeException("Customer is required");
        }
        if(workOrder.getSite() == null || workOrder.getSite().getId() == null) {
        	throw new RuntimeException("Site is required");
        }
        Customer customer = customerRepo.findById(workOrder.getCustomer().getId())
        		.orElseThrow(()-> new RuntimeException("Customer not found"));
        Site site = siteRepo.findById(workOrder.getSite().getId())
        		.orElseThrow(()-> new RuntimeException("Site not found"));
        if(!site.getCustomer().getId().equals(customer.getId())) {
        	throw new RuntimeException("Site does not belong to customer");
        }
        workOrder.setCustomer(customer);
        workOrder.setSite(site);
        
        workOrder.setStatus(WorkOrderStatus.NEW);
        workOrder.setWorkCode(generateCode());
        if(workOrder.getTotalPartsCost() == null) {
        	workOrder.setTotalPartsCost(BigDecimal.ZERO);
        }
        if(workOrder.getSlaDueAt() == null) {
        	workOrder.setSlaDueAt(calculateSlaDueDate(workOrder.getPriority()));
        }
        User changedBy = userRepo.findByUserEmail(authenticaton.getName())
        		.orElseThrow(() -> new RuntimeException("User nto found"));
        WorkOrder saved = workOrderRepo.save(workOrder);
        WorkOrderStatusHistory history = WorkOrderStatusHistory.builder()
        		.workOrder(saved)
        		.fromStatus(null)
        		.toStatus(WorkOrderStatus.NEW)
        		.changedBy(changedBy)
        		.note("Work order created")
        		.build();
        historyRepo.save(history);
		return saved;
	}

	@Override
	public WorkOrder getById(Long id) {
		
		return workOrderRepo.findById(id)
				.orElseThrow(()-> new RuntimeException("Work order not found: "+id));
	}

	@Override
	public Page<WorkOrderResponseDTO> getAll(Pageable pageable) {
		
		return workOrderRepo.findAll(pageable).map(this::convertWorkOrderResponseDTO);
	}

	@Override
	public WorkOrder update(Long id, WorkOrder request) {
		WorkOrder existing = getById(id);
		if(existing.getStatus() == WorkOrderStatus.CLOSED || existing.getStatus() == WorkOrderStatus.CANCELLED) {
			throw new RuntimeException("Closed or cancelled work order cannot be edited");
		}
		existing.setTitle(request.getTitle());
		existing.setDescription(request.getDescription());
		existing.setPriority(request.getPriority());
		return workOrderRepo.save(existing);
	}

	@Override
	public WorkOrder assign(Long workOrderId, Long technicianId) {
		WorkOrder workOrder = getById(workOrderId);
		User technician = userRepo.findById(technicianId)
				.orElseThrow(()-> new RuntimeException("Technician not found"));
		if(technician.getRole() != Role.TECHNICIAN) {
			throw new RuntimeException("Selected user is not a technician");
		}
		if(workOrder.getStatus() == WorkOrderStatus.CLOSED || workOrder.getStatus() == WorkOrderStatus.CANCELLED) {
			throw new RuntimeException("Cannot assign terminal work order");
		}
		workOrder.setAssignedTechnician(technician);
		workOrder.setStatus(WorkOrderStatus.ASSIGNED);
		
		return workOrderRepo.save(workOrder);
	}

	@Override
	public WorkOrder changeStatus(Long workOrderId, WorkOrderStatus newStatus, Long userId, String note) {
		WorkOrder workOrder = getById(workOrderId);
		User user = userRepo.findById(userId)
				.orElseThrow(()-> new RuntimeException("User not found"));
		WorkOrderStatus oldStatus = workOrder.getStatus();
		validteTransition(oldStatus,newStatus);
		validateRole(workOrder,user,newStatus);
		workOrder.setStatus(newStatus);
		updateImportantDates(workOrder,newStatus);
		
		WorkOrderStatusHistory history = WorkOrderStatusHistory.builder()
				.workOrder(workOrder)
				.fromStatus(oldStatus)
				.toStatus(newStatus)
				.changedBy(user)
				.note(note)
				.build();
		historyRepo.save(history);
		
		return workOrderRepo.save(workOrder);
	}

	@Override
	public Page<WorkOrderResponseDTO> getTechnicianOrders(Long technicianId,Pageable pageable) {
		
		Page<WorkOrder> workOrders = workOrderRepo.findByAssignedTechnicianId(technicianId,pageable);
		return workOrders.map(this::convertWorkOrderResponseDTO);
	}

	@Override
	public Page<WorkOrder> getCustomerOrders(Long customerId, Pageable pageable) {
		
		return workOrderRepo.findByCustomerId(customerId, pageable);
	}
	
	public WorkOrderResponseDTO getByWorkCode(String workCode) {
		WorkOrder workOrder = workOrderRepo.findByWorkCode(workCode)
				.orElseThrow(() -> new RuntimeException("Work order not found: "+workCode));
		return convertWorkOrderResponseDTO(workOrder);
	}
	
	public List<WorkOrderResponseDTO> viewOwnRequest(Authentication authentication){
		if(authentication == null) {
			throw new RuntimeException("Authentication required");
		}
		User user = userRepo.findByUserEmail(authentication.getName())
				.orElseThrow(()-> new RuntimeException("User not found"));
		if(user.getRole() != Role.CUSTOMER) {
			throw new RuntimeException("Only customer can view requests");
		}
		Customer customer = customerRepo.findByEmail(user.getUserEmail())
				.orElseThrow(()-> new RuntimeException("Customer not found"));
		List<WorkOrder> workOrders = workOrderRepo.findByCustomer_Id(customer.getId());
		
		return workOrders.stream()
				.map(this::convertWorkOrderResponseDTO)
				.toList();
	}
	// cancel workOrder
	public WorkOrderResponseDTO cancel(Long WorkOrderId, Authentication authentication) {
		if(authentication == null) {
			throw new RuntimeException("Authenctication required");
		}
		User user = userRepo.findByUserEmail(authentication.getName())
				.orElseThrow(() -> new RuntimeException("User not find"));
		WorkOrder workOrder = changeStatus(WorkOrderId, WorkOrderStatus.CANCELLED, user.getId(), "Work order cancelled by "+user.getRole());
		return convertWorkOrderResponseDTO(workOrder);
	}
	//Lifecycle
	private void validteTransition(WorkOrderStatus from, WorkOrderStatus to) {
		Map<WorkOrderStatus,Set<WorkOrderStatus>> allowed = new EnumMap<>(WorkOrderStatus.class);
		allowed.put(WorkOrderStatus.NEW, Set.of(WorkOrderStatus.ASSIGNED,WorkOrderStatus.CANCELLED));
		allowed.put(WorkOrderStatus.ASSIGNED, Set.of(WorkOrderStatus.IN_PROGRESS,WorkOrderStatus.CANCELLED));
		allowed.put(WorkOrderStatus.IN_PROGRESS, Set.of(WorkOrderStatus.ON_HOLD,WorkOrderStatus.COMPLETED,WorkOrderStatus.CANCELLED));
		allowed.put(WorkOrderStatus.ON_HOLD, Set.of(WorkOrderStatus.IN_PROGRESS,WorkOrderStatus.CANCELLED));
		allowed.put(WorkOrderStatus.COMPLETED, Set.of(WorkOrderStatus.CLOSED));
		allowed.put(WorkOrderStatus.CLOSED, Set.of());
		allowed.put(WorkOrderStatus.CANCELLED, Set.of());
		
		if(!allowed.getOrDefault(from, Set.of())
				.contains(to)){
			throw new IllegalStateException("Invalid status transition: "+from + " -> "+to);
			
		}
	}
	private void validateRole(WorkOrder workOrder,User user,WorkOrderStatus newStatus) {
		Role role = user.getRole();
		if(newStatus == WorkOrderStatus.CLOSED) {
			if(role != Role.MANAGER) {
				throw new SecurityException("Only manager can close work order");
			}
			return;
		}
		//Technician-specific operations
		if(newStatus == WorkOrderStatus.IN_PROGRESS || newStatus == WorkOrderStatus.ON_HOLD || newStatus == WorkOrderStatus.COMPLETED) {
			if(role != Role.TECHNICIAN) {
				throw new SecurityException("Only technician can perform this action");
			}
		if(workOrder.getAssignedTechnician() == null || !workOrder.getAssignedTechnician().getId().equals(user.getId())) {
			throw new SecurityException("Technician is not assigned to this work order");
		}
	}
	}
	
	private void updateImportantDates(WorkOrder workOrder,WorkOrderStatus status) {
		LocalDateTime now = LocalDateTime.now();
		if(status == WorkOrderStatus.IN_PROGRESS) {
			if(workOrder.getStartedAt() == null ) {
				workOrder.setStartedAt(now);
			}
		}
		if(status == WorkOrderStatus.COMPLETED) {
			workOrder.setClosedAt(now);
		}
		if(status == WorkOrderStatus.CLOSED) {
			workOrder.setClosedAt(now);
		}
	}
	private String generateCode() {
		return "WO-"+UUID.randomUUID()
		                 .toString()
		                 .substring(0,8)
		                 .toUpperCase();
	}
	private LocalDateTime calculateSlaDueDate(Priority priority) {
		LocalDateTime now = LocalDateTime.now();
		if(priority == null) {
			return now.plusHours(48);
		}
		
		return switch (priority) {
		case CRITICAL -> now.plusHours(4);
		case HIGH -> now.plusHours(12);
		case MEDIUM -> now.plusHours(24);
		case LOW -> now.plusHours(72);
		};
	}
	private User getSystemUser() {
		return userRepo.findByUserEmail("system@keystone.local")
				.orElseThrow(()-> new RuntimeException("System user not configured"));
	}
	@Override
	public WorkOrder raiseRequest(WorkOrder workOrder, Authentication authentication) {
		if(authentication == null) {
			throw new RuntimeException("Authentication required");
		}
		User customerUser = userRepo.findByUserEmail(
				authentication.getName())
				.orElseThrow(() -> new RuntimeException("Logged-in user not found"));
		if(customerUser.getRole() != Role.CUSTOMER) {
			throw new SecurityException("Only customer can raise request");
		}
		if(workOrder.getSite() == null || workOrder.getSite().getId() == null) {
			throw new RuntimeException("Site is required");
		}
		Customer customer = customerRepo.findById(workOrder.getCustomer().getId())
				.orElseThrow(() -> new RuntimeException("Customer not found"));
		Site site = siteRepo.findById(workOrder.getSite().getId())
				.orElseThrow(() -> new RuntimeException("Site not found"));
		if(!site.getCustomer().getId().equals(customer.getId())) {
			throw new RuntimeException("Site does not belong to customer");
		}
		workOrder.setCustomer(customer);
		workOrder.setSite(site);
		
		workOrder.setStatus(WorkOrderStatus.NEW);
		workOrder.setWorkCode(generateCode());
		
		if(workOrder.getSlaDueAt() == null) {
			workOrder.setSlaDueAt(calculateSlaDueDate(workOrder.getPriority()));
		}
		WorkOrder saved = workOrderRepo.save(workOrder);
		WorkOrderStatusHistory history = 
				WorkOrderStatusHistory.builder()
				.workOrder(saved)
				.fromStatus(null)
				.toStatus(WorkOrderStatus.NEW)
				.changedBy(customerUser)
				.note("Request raised by customer")
				.build();
		historyRepo.save(history);
		return saved;
	}

	private WorkOrderResponseDTO convertWorkOrderResponseDTO(WorkOrder workOrder) {
		WorkOrderResponseDTO dto = new WorkOrderResponseDTO();
		dto.setId(workOrder.getId());
		dto.setWorkCode(workOrder.getWorkCode());
		dto.setTitle(workOrder.getTitle());
	    dto.setDescription(workOrder.getDescription());
	    if(workOrder.getPriority() != null) {
	    	dto.setPriority(workOrder.getPriority().name());
	    }
	    if(workOrder.getStatus() != null) {
	    	dto.setStatus(workOrder.getStatus().name());
	    }
	    dto.setSlaDueAt(workOrder.getSlaDueAt());
	    
	    if(workOrder.getCustomer() != null) {
	    	dto.setCustomerId(workOrder.getCustomer().getId());
	    	dto.setCompanyName(workOrder.getCustomer().getCompanyName());
	    	dto.setContactPerson(workOrder.getCustomer().getContactPerson());
	    	dto.setEmail(workOrder.getCustomer().getEmail());
	    	dto.setPhone(workOrder.getCustomer().getPhone());
	    }
	    if(workOrder.getSite() != null) {
	    	dto.setSiteId(workOrder.getSite().getId());
	    	dto.setSiteName(workOrder.getSite().getSiteName());
	    	dto.setAddressDetails(workOrder.getSite().getAddressDetails());
	    	dto.setFloorNo(workOrder.getSite().getFloorNo());
	    	dto.setAppartmentName(workOrder.getSite().getAppartmentName());
	    	dto.setCity(workOrder.getSite().getCity());
	    	dto.setCountry(workOrder.getSite().getCountry());
	    }
	    if(workOrder.getAssignedTechnician() != null) {
	    	dto.setAssignedTechnicianId(workOrder.getAssignedTechnician().getId());
	    	dto.setAssignTechnician(workOrder.getAssignedTechnician().getFname() + " "+ workOrder.getAssignedTechnician().getLname());
	    }
	    List<WorkOrderStatusHistory> historyList = historyRepo.findByWorkOrderIdOrderByChangedAtAsc(workOrder.getId());
	    List<StatusTimelineDTO> timeline = historyList.stream()
	    		.map(history -> new StatusTimelineDTO(
	    				history.getChangedAt(),
	    				history.getToStatus().name(),
	    				getTimelineTitle(history.getToStatus()),
	    				history.getChangedBy().getFname()+" "+history.getChangedBy().getLname(),
	    				history.getNote())).toList();
        dto.setHistory(timeline);
        
        List<PartUsageDTO> partUsageDTOs = workOrder.getPartUsages()
        		.stream()
        		.map(usage -> {
        			BigDecimal total = usage.getPart().getUnitCost()
        					.multiply(BigDecimal.valueOf(usage.getQuantity()));
        			
        return new PartUsageDTO(
        		usage.getId(),
        		usage.getPart().getId(),
        		usage.getPart().getName(),
        		usage.getPart().getSku(),
        		usage.getPart().getUnitCost(),
        		usage.getQuantity(),
        		total
        		);
        	}).toList();
        dto.setPartUsages(partUsageDTOs);
        
	    dto.setStartedAt(workOrder.getStartedAt());
	    dto.setCompletedAt(workOrder.getCompletedAt());
	    dto.setClosedAt(workOrder.getClosedAt());
	    dto.setCreatedOn(workOrder.getCreatedOn());


	    
	    return dto;
	}
    @Override
    public CustomerDashboardDTO getCustomerDashboard(Authentication authentication) {
    	User user = userRepo.findByUserEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Customer customer = customerRepo
                .findByEmail(user.getUserEmail())
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));

        Long customerId = customer.getId();

        long totalRequests =
                workOrderRepo.countByCustomer_Id(customerId);

        long inProgress =
                workOrderRepo.countByCustomer_IdAndStatus(
                        customerId,
                        WorkOrderStatus.IN_PROGRESS
                );

        long completed =
                workOrderRepo.countByCustomer_IdAndStatus(
                        customerId,
                        WorkOrderStatus.COMPLETED
                );

        long onHold =
                workOrderRepo.countByCustomer_IdAndStatus(
                        customerId,
                        WorkOrderStatus.ON_HOLD
                );

        return new CustomerDashboardDTO(
                totalRequests,
                inProgress,
                completed,
                onHold
        );
    }
	//start work
    @Override
    public WorkOrderResponseDTO startWork(Long workOrderId,Authentication authentication) {
    	if(authentication == null) {
    		throw new RuntimeException("Authentication required");
    	}
    	String email = authentication.getName();
    	User technician = userRepo.findByUserEmail(email)
    			.orElseThrow(() -> new RuntimeException("User not found"));
    	
    	if(technician.getRole() != Role.TECHNICIAN) {
    		throw new RuntimeException("Only technician can start work");
    	}
    	WorkOrder workOrder = getById(workOrderId);
    	if(workOrder.getAssignedTechnician() == null) {
    		throw new RuntimeException("Work order is not assigned to any technicia");
    	}
    	if(!workOrder.getAssignedTechnician().getId().equals(technician.getId())) {
    		throw new RuntimeException("This work order is not assigned to you");
    	}
    	if(workOrder.getStatus() != WorkOrderStatus.ASSIGNED) {
    		throw new RuntimeException("Only assigned work order can be started");
    	}
    	WorkOrder updatedWorkOrder = changeStatus(workOrderId, WorkOrderStatus.IN_PROGRESS, technician.getId(), "Work started by technician");
    	return convertWorkOrderResponseDTO(updatedWorkOrder);
    }
    // TimeLine title helper
    private String getTimelineTitle(WorkOrderStatus status) {

        return switch (status) {

            case NEW ->
                    "Work Order Created";

            case ASSIGNED ->
                    "Technician Assigned";

            case IN_PROGRESS ->
                    "Work Started";

            case ON_HOLD ->
                    "Work Put On Hold";

            case COMPLETED ->
                    "Work Completed";

            case CANCELLED ->
                    "Work Order Cancelled";

            case CLOSED ->
                    "Work Order Closed";

            default ->
                    status.name();
        };
    }
    @Override
    public WorkOrderResponseDTO getByIdAsDTO(Long id) {
    	WorkOrder workOrder = getById(id);
    	
    	return convertWorkOrderResponseDTO(workOrder);
    }
    @Override
    public WorkOrderResponseDTO holdWork(Long workOrderId, Authentication authentication) {
    	if(authentication == null) {
    		throw new RuntimeException("Authentication required");
    	}
    	String email = authentication.getName();

        User technician = userRepo.findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (technician.getRole() != Role.TECHNICIAN) {
            throw new RuntimeException(
                    "Only technician can hold work");
        }

        WorkOrder workOrder = getById(workOrderId);

        validateAssignedTechnician(workOrder, technician);

        if (workOrder.getStatus() != WorkOrderStatus.IN_PROGRESS) {
            throw new RuntimeException(
                    "Only work in progress can be put on hold");
        }

        WorkOrder updated = changeStatus(
                workOrderId,
                WorkOrderStatus.ON_HOLD,
                technician.getId(),
                "Work put on hold by technician"
        );

        return convertWorkOrderResponseDTO(updated);
    }
    @Override
    public WorkOrderResponseDTO completeWork(Long workOrderId, Authentication authentication) {
    	if(authentication == null) {
    		throw new RuntimeException("Authentication required");
    	}
    	String email = authentication.getName();

        User technician = userRepo.findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (technician.getRole() != Role.TECHNICIAN) {
            throw new RuntimeException(
                    "Only technician can complete work");
        }

        WorkOrder workOrder = getById(workOrderId);

        validateAssignedTechnician(workOrder, technician);

        if (workOrder.getStatus() != WorkOrderStatus.IN_PROGRESS) {
            throw new RuntimeException(
                    "Only work in progress can be completed");
        }

        WorkOrder updated = changeStatus(
                workOrderId,
                WorkOrderStatus.COMPLETED,
                technician.getId(),
                "Work completed by technician"
        );

        return convertWorkOrderResponseDTO(updated);
    }
    @Override
    public WorkOrderResponseDTO resumeWork(Long workOrderId, Authentication authentication) {
    	if(authentication == null) {
    		throw new RuntimeException("Authentication required");
    	}
    	String email = authentication.getName();

        User technician = userRepo.findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (technician.getRole() != Role.TECHNICIAN) {
            throw new RuntimeException(
                    "Only technician can resume work");
        }

        WorkOrder workOrder = getById(workOrderId);

        validateAssignedTechnician(workOrder, technician);

        if (workOrder.getStatus() != WorkOrderStatus.ON_HOLD) {
            throw new RuntimeException(
                    "Only work on hold can be resumed");
        }

        WorkOrder updated = changeStatus(
                workOrderId,
                WorkOrderStatus.IN_PROGRESS,
                technician.getId(),
                "Work resumed by technician"
        );

        return convertWorkOrderResponseDTO(updated);
    }
    
    private void validateAssignedTechnician(WorkOrder workOrder, User technician) {
    	if(workOrder.getAssignedTechnician() == null) {
    		throw new RuntimeException("Work order is not assigned to any technician");
    	}
    	if(!workOrder.getAssignedTechnician().getId().equals(technician.getId())){
    		throw new RuntimeException("This work order is not assigned to you");
    	}
    }
	
}
