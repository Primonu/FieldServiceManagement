package com.fieldManagementService.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.fieldManagementService.Entity.Part;
import com.fieldManagementService.Entity.PartUsage;
import com.fieldManagementService.Service.PartServiceImpl;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/parts")
@RequiredArgsConstructor
public class PartController {
	@Autowired
	private PartServiceImpl partService;
	
	@PostMapping("/use")
	@PreAuthorize("hasAuthority('USE_PARTS')")
	public ResponseEntity<PartUsage> usePart(@RequestParam Long workOrderId,@RequestParam Long partId,@RequestParam Integer quantity,@RequestParam Long technicianId){
		return ResponseEntity.ok(partService.usePart(workOrderId, partId, quantity, technicianId));
	}
	@PostMapping()
	@PreAuthorize("hasAuthority('ADD_PARTS')")
	public ResponseEntity<Part>createParts(@RequestBody Part part){
		return ResponseEntity.ok(partService.createPart(part));
	}
	@GetMapping()
	@PreAuthorize("hasAuthority('VIEW_PARTS')")
	public ResponseEntity<Page<Part>>getAllParts(Pageable pageable){
		return ResponseEntity.ok(partService.getAllPart(pageable));
	}
	@GetMapping("/{id}")
	@PreAuthorize("hasAuthority('VIEW_PARTS')")
	public ResponseEntity<Part>getPartById(@PathVariable Long id){
		return ResponseEntity.ok(partService.getPartById(id));
	}
	@PutMapping("/{id}")
	@PreAuthorize("hasAuthority('UPDATE_PARTS')")
	public ResponseEntity<Part>updateParts(@PathVariable Long id,@RequestBody Part part){
		return ResponseEntity.ok(partService.updatePart(id, part));
	}
	@DeleteMapping("/{id}")
	@PreAuthorize("hasAuthority('DELETE_PART')")
	public ResponseEntity<String>deletePart(@PathVariable Long id){
		partService.deletePart(id);
		return ResponseEntity.ok("Delete part successfully");
	}
	@GetMapping("/search")
	public ResponseEntity<Page<Part>>searchParts(@RequestParam String name,Pageable pageable){
		return ResponseEntity.ok(partService.searchParts(name, pageable));
	}
	@GetMapping("/stock/{id}")
	public ResponseEntity<Integer>getStock(@PathVariable Long id){
		return ResponseEntity.ok(partService.getStock(id));
	}
	

}
