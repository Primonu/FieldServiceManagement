package com.fieldManagementService.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fieldManagementService.DTO.SiteResponseDTO;
import com.fieldManagementService.Entity.Site;
import com.fieldManagementService.Service.SiteServiceImpl;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sites")
@RequiredArgsConstructor
public class SiteController {
	@Autowired
	private SiteServiceImpl siteService;
	
	@PostMapping("/{customerId}")
	@PreAuthorize("hasAuthority('CREATE_SITE')")
	public ResponseEntity<Site>createSites(@PathVariable Long customerId,
			@RequestBody Site site){
		System.out.println("Inside controller method for create site");
		return ResponseEntity.ok(siteService.createSite(customerId,site));
	}
	@PutMapping("/{id}")
	@PreAuthorize("hasAuthority('UPDATE_SITE')")
	public ResponseEntity<Site>updateSites(@PathVariable Long id,@RequestBody Site site){
		return ResponseEntity.ok(siteService.updateSite(id, site));
	}
	@GetMapping("/{id}")
	@PreAuthorize("hasAuthority('VIEW_SITE')")
	public ResponseEntity<Site>getSites(@PathVariable Long id){
		return ResponseEntity.ok(siteService.getSite(id));
	}
	@GetMapping("/customer/{customerId}")
	@PreAuthorize("hasAuthority('VIEW_SITE')")
	public ResponseEntity<List<Site>>getByCustomer(@PathVariable Long customerId){
		return ResponseEntity.ok(siteService.getSiteByCustomer(customerId));
	}
	@GetMapping
	@PreAuthorize("hasAuthority('VIEW_SITE')")
	public ResponseEntity<List<SiteResponseDTO>>getAllSite(){
		return ResponseEntity.ok(siteService.getAllSites());
	}
	@DeleteMapping("/{id}")
	@PreAuthorize("hasAuthority('DELETE_SITE')")
	public ResponseEntity<String>deleteSite(@PathVariable Long id){
		siteService.deleteSite(id);
		return ResponseEntity.ok("Site delete successfully");
	}

}
