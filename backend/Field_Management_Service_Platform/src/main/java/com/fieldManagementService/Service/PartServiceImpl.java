package com.fieldManagementService.Service;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.fieldManagementService.Entity.Part;
import com.fieldManagementService.Entity.PartUsage;
import com.fieldManagementService.Entity.User;
import com.fieldManagementService.Entity.WorkOrder;
import com.fieldManagementService.Enum.Role;
import com.fieldManagementService.Enum.WorkOrderStatus;
import com.fieldManagementService.Repository.PartRepository;
import com.fieldManagementService.Repository.PartUsageRepository;
import com.fieldManagementService.Repository.UserRepository;
import com.fieldManagementService.Repository.WorkOrderRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PartServiceImpl implements PartService {
	@Autowired
	private PartRepository partRepo;
	@Autowired
	private WorkOrderRepository workOrderRepo;
	@Autowired
	private UserRepository userRepo;
	@Autowired
	private PartUsageRepository partUsageRepo;

	@Override
	@Transactional
	public PartUsage usePart(Long workOrderId, Long partId, Integer quantity, Long technicianId) {
		if(quantity == null || quantity <= 0) {
			throw new IllegalArgumentException("Quantity must be greater than zero");
		}
		WorkOrder workOrder = workOrderRepo.findById(workOrderId)
				.orElseThrow(()-> new RuntimeException("Work order not found"));
		User technician = userRepo.findById(technicianId)
				.orElseThrow(() -> new RuntimeException("Technician not found"));
		
		if(technician.getRole() != Role.TECHNICIAN) {
			throw new SecurityException("Only technician can use parts");
		}
		if(workOrder.getAssignedTechnician() == null || !workOrder.getAssignedTechnician()
				.getId()
				.equals(technicianId)) {
			throw new SecurityException("Technician is not assigned to this work order");
		}
		if(workOrder.getStatus() == WorkOrderStatus.CLOSED || workOrder.getStatus() == WorkOrderStatus.CANCELLED) {
			throw new RuntimeException("Cannot use parts on closed/canncelled work order");
		}
		
		Part part = partRepo.findByIdForUpdate(partId)
				.orElseThrow(()-> new RuntimeException("Part not found"));
		if(part.getStockQty() < quantity) {
			throw new RuntimeException("Insufficient stock. Available: "+part.getStockQty());
		}
		part.setStockQty(part.getStockQty() - quantity);
		partRepo.save(part);
		BigDecimal totalCost = part.getUnitCost()
				.multiply(BigDecimal.valueOf(quantity));
		
		PartUsage usage = PartUsage.builder()
				.workOrder(workOrder)
				.part(part)
				.technician(technician)
				.quantity(quantity)
				.unitCost(part.getUnitCost())
				.totalCost(totalCost)
				.build();
		PartUsage saved = partUsageRepo.save(usage);
		
		BigDecimal oldTotal = workOrder.getTotalPartsCost()!=null ? workOrder.getTotalPartsCost(): BigDecimal.ZERO;
		workOrder.setTotalPartsCost(oldTotal.add(totalCost));
	    workOrderRepo.save(workOrder);
	    return saved;
	}
	@Override
	public Part createPart(Part part) {
		if(partRepo.existsBySku(part.getSku())) {
			throw new RuntimeException("Part with SKU already exists");
		}
		if(part.getStockQty() < 0) {
			throw new RuntimeException("Stock quantity cannot be negative");
		}
		return partRepo.save(part);
	}
	@Override
	public Part updatePart(Long id, Part part) {
		Part existingPart = getPartById(id);
		if(!existingPart.getSku().equals(part.getSku()) && partRepo.existsBySku(part.getSku())) {
			throw new RuntimeException("Part with SKU already exists");
		}
		if(part.getStockQty() < 0) {
			throw new RuntimeException("Stock quantity cannot be negative");
		}
		existingPart.setName(part.getName());
		existingPart.setSku(part.getSku());
		existingPart.setUnitCost(part.getUnitCost());
		existingPart.setStockQty(part.getStockQty());
		return partRepo.save(existingPart);
	}
	@Override
	public Page<Part> getAllPart(Pageable pageable) {
		
		return partRepo.findAll(pageable);
	}
	@Override
	public Part getPartById(Long id) {
		// TODO Auto-generated method stub
		return partRepo.findById(id)
				.orElseThrow(()-> new RuntimeException("Part not found with id: "+ id));
	}
	@Override
	public void deletePart(Long id) {
		Part part = getPartById(id);
		partRepo.delete(part);
		
	}
	@Override
	public Page<Part> searchParts(String name, Pageable pageable) {
		
		return partRepo.findByName(name, pageable);
	}
	@Override
	public Integer getStock(Long partId) {
		Part part = getPartById(partId);
		return part.getStockQty();
	}
	@Override
	public Part decreaseStock(Long partId, Integer quantity) {
		if(quantity == null || quantity <= 0) {
			throw new RuntimeException("Quantity must be greater than zero");
		}
		Part part = partRepo.findByIdForUpdate(partId)
				.orElseThrow(()-> new RuntimeException("Part not found"));
		if(part.getStockQty() < quantity) {
			throw new RuntimeException("Insufficient stock");
		}
		part.setStockQty(part.getStockQty() - quantity);
		return partRepo.save(part);
	}

}
