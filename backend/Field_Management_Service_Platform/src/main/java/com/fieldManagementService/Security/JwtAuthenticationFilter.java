package com.fieldManagementService.Security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter{
	@Autowired
	private JWTTokenUtil jwtToken;
	
	@Autowired
	private TokenBlockService tokenBlockService;
	
	private final CustomUserDetailsService customUserDetailsService;
	
	public JwtAuthenticationFilter(JWTTokenUtil jwtToken,CustomUserDetailsService customUserDetailsService,TokenBlockService tokenBlockService) {
		// TODO Auto-generated constructor stub
		this.customUserDetailsService = customUserDetailsService;
		this.jwtToken = jwtToken;
		this.tokenBlockService = tokenBlockService;
	}
	@Override
	protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,FilterChain filterChain)throws ServletException,IOException {
		String header = request.getHeader("Authorization");
		String token = null;
		//String token = jwtToken.extractToken(header);
		
		if(StringUtils.hasText(header) && header.startsWith("Bearer ")) {
			token = header.substring(7);
		}
		if(token == null) {
			filterChain.doFilter(request, response);
			return;
		}
		if(tokenBlockService.isblockListToken(token)) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.getWriter().write("Logged out");
			return;
		}
//		if(token != null) {
//			if(tokenBlockService.isblockListToken(token)) {
//				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//				response.getWriter().write("Logged out");
//			}
//		}
		try {
		if(jwtToken.validateToken(token)) {
			String userEmail = jwtToken.getUserEmail(token);
			UserDetails userDetail = customUserDetailsService.loadByUserEmail(userEmail);
			
			UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userDetail,null, userDetail.getAuthorities());
			auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				
			SecurityContextHolder.getContext().setAuthentication(auth);
		}
		}catch(Exception e) {
			System.out.println("JWT Authentication failed: "+e.getMessage());
		}
		
		filterChain.doFilter(request, response);
		
	}

}
