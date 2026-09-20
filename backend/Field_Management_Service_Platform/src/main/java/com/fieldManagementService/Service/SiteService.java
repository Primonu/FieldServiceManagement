package com.fieldManagementService.Service;

import java.util.List;

import com.fieldManagementService.DTO.SiteResponseDTO;
import com.fieldManagementService.Entity.Site;

public interface SiteService {
	public Site createSite(Long customerId,Site site);
	public Site updateSite(Long id,Site siteDetails);
	public Site getSite(Long id);
	public List<Site>getSiteByCustomer(Long customerId);
	public List<SiteResponseDTO>getAllSites();
	public void deleteSite(Long id);
	

}
