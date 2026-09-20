package com.fieldManagementService.Security;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import com.fieldManagementService.Enum.Permissions;
import com.fieldManagementService.Enum.Role;

public class RoleBasedPermission {
	public static Map<Role,Set<Permissions>>getRoleWisePermission(){
		Map<Role,Set<Permissions>> perm = new HashMap<>();
		perm.put(Role.MANAGER, new HashSet<>(Arrays.asList(Permissions.CREATE_USER,
				Permissions.UPDATE_USER,
				Permissions.VIEW_USER,
				Permissions.DELETE_USER,
				
				Permissions.CREATE_CUSTOMER,
				Permissions.UPDATE_CUSTOMER,
				Permissions.VIEW_CUSTOMER,
				Permissions.DELETE_CUSTOMER,
				
				Permissions.CREATE_SITE,
				Permissions.UPDATE_SITE,
				Permissions.VIEW_SITE,
				Permissions.DELETE_SITE,
				
				Permissions.CREATE_WO,
				Permissions.UPDATE_WO,
				Permissions.VIEW_WO,
				Permissions.ASSIGN_WO,
				Permissions.CANCEL_WO,
				Permissions.CLOSE_WO,
				Permissions.DELETE_WO,
				
				Permissions.ADD_PARTS,
				Permissions.UPDATE_PARTS,
				Permissions.VIEW_PARTS,
				Permissions.USE_PARTS,
				Permissions.DELETE_PART,
				
				Permissions.ADD_LOG_TIME,
				Permissions.VIEW_LOG_TIME,
				
				Permissions.VIEW_DASHBOARD,
				Permissions.VIEW_REPORTS,
				
				Permissions.SEND_NOTIFICATION
				)));
		perm.put(Role.DISPATCHER, new HashSet<>(Arrays.asList(Permissions.CREATE_CUSTOMER,
				Permissions.UPDATE_CUSTOMER,
				Permissions.VIEW_CUSTOMER,
				
				Permissions.CREATE_SITE,
				Permissions.UPDATE_SITE,
				Permissions.VIEW_SITE,
				
				Permissions.CREATE_WO,
				Permissions.UPDATE_WO,
				Permissions.VIEW_WO,
				Permissions.ASSIGN_WO,
				Permissions.CANCEL_WO,
				
				Permissions.VIEW_DASHBOARD
				)));
		
		perm.put(Role.TECHNICIAN, new HashSet<>(Arrays.asList(Permissions.VIEW_WO,
				Permissions.START_WORK,
				Permissions.HOLD_WORK,
				Permissions.RESUME_WORK,
				Permissions.COMPLETED_WORK,
				
				Permissions.USE_PARTS,
				Permissions.VIEW_PARTS,
				
				Permissions.ADD_LOG_TIME,
				Permissions.VIEW_LOG_TIME
				)));
		
		perm.put(Role.CUSTOMER, new HashSet<>(Arrays.asList(Permissions.RAISE_REQUEST,
				Permissions.VIEW_OWN_REQUEST
				)));
		
		return perm;
	}

}
