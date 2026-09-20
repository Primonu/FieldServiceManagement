package com.fieldManagementService.Security;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.fieldManagementService.Entity.User;
import com.fieldManagementService.Enum.Permissions;
import com.fieldManagementService.Repository.UserRepository;
@Service
public class CustomUserDetailsService implements UserDetailsService {

	private final UserRepository userRepo;
	public CustomUserDetailsService(UserRepository userRepo) {
		this.userRepo=userRepo;
	}
	
	
	public UserDetails loadByUserEmail(String email) throws UsernameNotFoundException {
		User user = userRepo.findByUserEmail(email)
				.orElseThrow(() -> new RuntimeException("User not found"));
		Set<Permissions> permissions = RoleBasedPermission.getRoleWisePermission().get(user.getRole());
		List<GrantedAuthority> authorities = new ArrayList<>();
		if(user.getRole() != null) {
			authorities.add(new SimpleGrantedAuthority("ROLE_"+user.getRole().name()));
		}
		if(permissions != null) {
			permissions.forEach(permission -> authorities.add(new SimpleGrantedAuthority(permission.name())));
		}
		//Set<Permissions>permission = RoleBasedPermission.getRoleWisePermission().get(user.getRole());
		return new org.springframework.security.core.userdetails.User(user.getUserEmail(), user.getPassword(),true,true,true,true, authorities);
	}


	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// TODO Auto-generated method stub
		return null;
	}

}
