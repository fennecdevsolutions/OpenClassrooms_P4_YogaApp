package com.openclassrooms.starterjwt.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

// Using Mockito extension instead of @SpringBootTest for speed of execution
@ExtendWith(MockitoExtension.class)
@DisplayName("Unit Tests for AuthService")
class AuthServiceTest {

	// Mocks

	@Mock
	private AuthenticationManager authenticationManager;

	@Mock
	private JwtUtils jwtUtils;

	@Mock
	private PasswordEncoder passwordEncoder;

	@Mock
	private UserRepository userRepository;

	@Mock
	private Authentication authentication;

	// CUT

	@InjectMocks
	private AuthService authService;

	@Nested
	@DisplayName("User Login Scenarios")
	class LoginTests {
		// Preparation
		private UserDetailsImpl userDetails;
		private LoginRequest loginRequest;
		private User user;

		@BeforeEach
		void setUp() {
			loginRequest = new LoginRequest();
			loginRequest.setEmail("test@mail.com");
			loginRequest.setPassword("password");
			userDetails = new UserDetailsImpl(1L, "test@mail.com", "John", "Doe", false, "password");
			user = new User();
			user.setEmail("test@mail.com");

		}

		@Test
		@DisplayName("Should return JWT response with admin status TRUE")
		void loginUser_shouldReturnJwtResponseWithAdminTrue_whenUserIsAdmin() {

			// Given

			user.setAdmin(true);

			when(authenticationManager.authenticate(any())).thenReturn(authentication);
			when(jwtUtils.generateJwtToken(authentication)).thenReturn("test-jwt-token");
			when(authentication.getPrincipal()).thenReturn(userDetails);
			when(userRepository.findByEmail("test@mail.com")).thenReturn(Optional.of(user));

			// When
			JwtResponse response = authService.loginUser(loginRequest);

			// Then
			assertThat(response).isNotNull();
			assertThat(response.getId()).isEqualTo(1);
			assertThat(response.getToken()).isEqualTo("test-jwt-token");
			assertThat(response.getAdmin()).isTrue();
			assertThat(response.getFirstName()).isEqualTo("John");
			assertThat(response.getLastName()).isEqualTo("Doe");
			verify(userRepository).findByEmail("test@mail.com");

		}

		@Test
		@DisplayName("Should return JWT response with admin status FALSE")
		void loginUser_shouldReturnJwtResponseWithAdminFalse_whenUserIsNotAdmin() {

			// Given

			user.setAdmin(false);

			when(authenticationManager.authenticate(any())).thenReturn(authentication);
			when(jwtUtils.generateJwtToken(authentication)).thenReturn("test-jwt-token");
			when(authentication.getPrincipal()).thenReturn(userDetails);
			when(userRepository.findByEmail("test@mail.com")).thenReturn(Optional.of(user));

			// When
			JwtResponse response = authService.loginUser(loginRequest);

			// Then
			assertThat(response).isNotNull();
			assertThat(response.getId()).isEqualTo(1);
			assertThat(response.getToken()).isEqualTo("test-jwt-token");
			assertThat(response.getAdmin()).isFalse();
			assertThat(response.getFirstName()).isEqualTo("John");
			assertThat(response.getLastName()).isEqualTo("Doe");
			verify(userRepository).findByEmail("test@mail.com");

		}

		@Test
		@DisplayName("Should return JWT response with admin status FALSE if the user is not found")
		void loginUser_shouldReturnJwtResponseWithAdminFalse_whenUserIsNotFound() {

			// Given

			when(authenticationManager.authenticate(any())).thenReturn(authentication);
			when(jwtUtils.generateJwtToken(authentication)).thenReturn("test-jwt-token");
			when(authentication.getPrincipal()).thenReturn(userDetails);
			when(userRepository.findByEmail("test@mail.com")).thenReturn(Optional.empty());

			// When
			JwtResponse response = authService.loginUser(loginRequest);

			// Then
			assertThat(response).isNotNull();
			assertThat(response.getId()).isEqualTo(1);
			assertThat(response.getToken()).isEqualTo("test-jwt-token");
			assertThat(response.getAdmin()).isFalse();
			assertThat(response.getFirstName()).isEqualTo("John");
			assertThat(response.getLastName()).isEqualTo("Doe");
			verify(userRepository).findByEmail("test@mail.com");

		}
	}

	@Nested
	@DisplayName("User Register Scenarios")
	class RegisterTests {
		// Preparation

		private SignupRequest signupRequest;
		private User user;

		@BeforeEach
		void setUp() {
			signupRequest = new SignupRequest();
			signupRequest.setEmail("test@mail.com");
			signupRequest.setPassword("password");
			signupRequest.setFirstName("John");
			signupRequest.setLastName("Doe");

		}

		@Test
		@DisplayName("Should return created User with signup data and admin status false if the email does not exist")
		void RegisterUser_shouldReturnUserWithSignupDataAndAdminFalse_whenEmailIsNotDuplicate() {

			// Given
			when(userRepository.existsByEmail(signupRequest.getEmail())).thenReturn(false);
			when(passwordEncoder.encode(signupRequest.getPassword())).thenReturn("EncodedPassword");
			user = new User(signupRequest.getEmail(), signupRequest.getLastName(), signupRequest.getFirstName(),
					"EncodedPassword", false);

			when(userRepository.save(any())).thenReturn(user);
			// When
			User savedUser = authService.registerUser(signupRequest);

			// Then
			assertThat(savedUser).isNotNull();
			assertThat(savedUser.isAdmin()).isFalse();
			assertThat(savedUser.getFirstName()).isEqualTo(signupRequest.getFirstName());
			assertThat(savedUser.getLastName()).isEqualTo(signupRequest.getLastName());
			assertThat(savedUser.getPassword()).isEqualTo("EncodedPassword");
			assertThat(savedUser.getEmail()).isEqualTo(signupRequest.getEmail());

			verify(userRepository).existsByEmail("test@mail.com");
			verify(userRepository).save(user);
			verify(passwordEncoder).encode(signupRequest.getPassword());

		}

		@Test
		@DisplayName("Should return null when the email exists")
		void RegisterUser_shouldReturnNull_whenEmailIsDuplicate() {

			// Given
			when(userRepository.existsByEmail(signupRequest.getEmail())).thenReturn(true);

			// When
			User savedUser = authService.registerUser(signupRequest);

			// Then
			assertThat(savedUser).isNull();
			verify(userRepository).existsByEmail("test@mail.com");
			verify(userRepository, never()).save(user);
			verify(passwordEncoder, never()).encode(signupRequest.getPassword());

		}

	}

}
