package com.fieldManagementService.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fieldManagementService.Entity.User;
import com.fieldManagementService.Enum.Role;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByUserEmail(String userEmail);
	Optional<User> findByResetToken(String resetToken);
    List<User> findByRole(Role role);
}
