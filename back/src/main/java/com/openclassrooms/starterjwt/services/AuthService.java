package com.openclassrooms.starterjwt.services;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

@Service
public class AuthService {

	private final AuthenticationManager authenticationManager;
	private final JwtUtils jwtUtils;
	private final PasswordEncoder passwordEncoder;
	private final UserRepository userRepository;

	public AuthService(AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder, JwtUtils jwtUtils,
			UserRepository userRepository) {
		this.authenticationManager = authenticationManager;
		this.jwtUtils = jwtUtils;
		this.passwordEncoder = passwordEncoder;
		this.userRepository = userRepository;
	}

	public JwtResponse loginUser(LoginRequest loginRequest) {
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtils.generateJwtToken(authentication);
		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

		boolean isAdmin = false;
		User user = this.userRepository.findByEmail(userDetails.getUsername()).orElse(null);
		if (user != null) {
			isAdmin = user.isAdmin();
		}
		JwtResponse jwtResponse = new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(),
				userDetails.getFirstName(), userDetails.getLastName(), isAdmin);

		return jwtResponse;
	}

	public User registerUser(SignupRequest signUpRequest) {
		if (userRepository.existsByEmail(signUpRequest.getEmail())) {
			return null;
		}

		// Create new user's account
		User user = new User(signUpRequest.getEmail(), signUpRequest.getLastName(), signUpRequest.getFirstName(),
				passwordEncoder.encode(signUpRequest.getPassword()), false);

		User createdUser = userRepository.save(user);

		return createdUser;
	}
}
