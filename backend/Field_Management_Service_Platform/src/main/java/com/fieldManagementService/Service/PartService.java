package com.fieldManagementService.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.fieldManagementService.Entity.Part;
import com.fieldManagementService.Entity.PartUsage;

public interface PartService {
	PartUsage usePart(Long workOrderId,Long partId,Integer quantity,Long technicianId);
	Part createPart(Part part);
	Page<Part>getAllPart(Pageable pageable);
	Part getPartById(Long id);
	Part updatePart(Long id,Part part);
	void deletePart(Long id);
	Page<Part> searchParts(String name,Pageable pageable);
	Integer getStock(Long partId);
	Part decreaseStock(Long partId,Integer quantity);

}
