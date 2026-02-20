package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {
	private final UserMapper userMapper;
	private final UserService userService;

	public UserController(UserService userService, UserMapper userMapper) {
		this.userMapper = userMapper;
		this.userService = userService;
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> findById(@PathVariable("id") String id) {
		User user = this.userService.findById(Long.valueOf(id));

		if (user == null) {
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok().body(this.userMapper.toDto(user));
	}

	@DeleteMapping("{id}")
	public ResponseEntity<?> delete(@PathVariable("id") String id) {
		Optional<Boolean> deletionResult = this.userService.fetchAndDelete(Long.valueOf(id));

		if (deletionResult.isEmpty()) {
			return ResponseEntity.notFound().build();
		} else if (deletionResult.get()) {
			return ResponseEntity.ok().build();
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

	}
}
