package com.fieldManagementService.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
	
	@Autowired
	private JWTTokenUtil jwtUtil;
	@Autowired
	private CustomUserDetailsService customUserDetailsService;
	@Autowired
	private TokenBlockService tokenBlockService;
	public SecurityConfig(JWTTokenUtil jwtUtil,CustomUserDetailsService customUserDetailsService,TokenBlockService tokenBlockService) {
		this.jwtUtil = jwtUtil;
		this.customUserDetailsService = customUserDetailsService;
		this.tokenBlockService = tokenBlockService;
	}
	//Authentication Manager
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config)throws Exception{
		return config.getAuthenticationManager();
	}
	//Password Encoder
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	//JWT Authentication Filter
	@Bean
	public JwtAuthenticationFilter jwtAuthenticationFilter() {
		return new JwtAuthenticationFilter(jwtUtil,customUserDetailsService,tokenBlockService);
	}
	//Security Configuration
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http,JwtAuthenticationFilter jwtAuthenticationFilter)throws Exception {
		http.cors(cors->{})
		.csrf(csrf -> csrf.disable())
		.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
		.authorizeHttpRequests(auth -> auth.requestMatchers(HttpMethod.OPTIONS,"/**").permitAll()
				.requestMatchers("/api/user_auth/**","/api/email_log/**")
				.permitAll()
				.anyRequest()
				.authenticated()
		   );
		        http.addFilterBefore(jwtAuthenticationFilter,
				UsernamePasswordAuthenticationFilter.class
				);
		
		return http.build();
	}

}
