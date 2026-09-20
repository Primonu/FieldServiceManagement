package com.fieldManagementService.Security;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.fieldManagementService.Entity.User;
import com.fieldManagementService.Enum.Permissions;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JWTTokenUtil {
	private final Key key;
	private final long tokenValidTime = 12*60*60*1000L;
	public JWTTokenUtil() {
		String secret = System.getenv("JWT_SECRET");
		if(secret == null || secret.isEmpty()) {
			secret="Replace this place with secret key";
		}
		key = Keys.hmacShaKeyFor(secret.getBytes());
	}
	
	public String generateToken(User user) {
		Map<String,Object>claims = new HashMap<>();
		claims.put("Role", user.getRole().name());
		
		Set<Permissions>perms = RoleBasedPermission.getRoleWisePermission()
				.get(user.getRole());
	//	List<String> permsName = perms == null ? List.class:perms.stream().map(Enum::name).collect(Collectors.toList());
		
		claims.put("Permissions", perms);
		
		Date now = new Date();
		Date expire = new Date(now.getTime()+tokenValidTime);
		return Jwts.builder()
				.setClaims(claims)
				.setSubject(user.getUserEmail())
				.setIssuedAt(now)
				.setExpiration(expire)
				.signWith(key, SignatureAlgorithm.HS256)
				.compact();
	}
	
	public boolean validateToken(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
			return true;
		}catch(Exception e) {
			return false;
		}
	}
	
	public Claims getClaim(String token) {
		return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
	}
	
	public String getUserEmail(String token) {
		return getClaim(token).getSubject();
	}
	public String extractToken(String header) {
		if(header != null && header.startsWith("Bearer ")) {
			return header.substring(7);
		}
		return null;
	}

}
