package com.openclassrooms.starterjwt.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("User Service Tests")
class UserServiceTest {

	@InjectMocks
	private UserService userService;

	@Mock
	private UserRepository userRepository;

	@Mock
	private SecurityContextHolder securityContextHolder;

	@Mock
	private SecurityContext securityContext;

	@Mock
	private Authentication authentication;

	@Mock
	private UserDetails userDetails;

	private Long id = 1L;
	private User user;

	@Test
	@DisplayName("Should delete User")
	void delete_shouldDeleteUserById() {
		// Given

		// When
		userService.delete(id);
		// Then
		verify(userRepository, times(1)).deleteById(id);
	}

	@Test
	@DisplayName("Should return empty if user is not found")
	void fetchAndDelete_shouldReturnEmpty_whenUserNotFound() {
		// Given
		when(userRepository.findById(id)).thenReturn(Optional.empty());

		// When
		Optional<Boolean> response = userService.fetchAndDelete(id);

		// Then
		assertThat(response).isEmpty();
		verify(userRepository, times(1)).findById(id);
		verify(userRepository, never()).deleteById(id);
	}

	@Test
	@DisplayName("Should return False if user email does not match authenticated user email")
	void fetchAndDelete_shouldReturnFalse_whenUserDoNotMatchAuthenticatedEmail() {
		// Given
		user = new User().setEmail("loggedUser@mail.com");
		SecurityContextHolder.setContext(securityContext);

		when(userRepository.findById(id)).thenReturn(Optional.of(user));

		when(securityContext.getAuthentication()).thenReturn(authentication);

		when(authentication.getPrincipal()).thenReturn(userDetails);

		when(userDetails.getUsername()).thenReturn("otherPerson@mail.com");

		// When
		Optional<Boolean> response = userService.fetchAndDelete(id);

		// Then
		assertThat(response).isNotEmpty();
		assertThat(response.get()).isFalse();
		verify(userRepository, times(1)).findById(id);
		verify(SecurityContextHolder.getContext().getAuthentication(), times(1)).getPrincipal();
		verify(userRepository, never()).deleteById(id);
	}

	@Test
	@DisplayName("Should delete user and return true when emails match")
	void fetchAndDelete_shouldReturnTrue_whenUserEmailMatchAuthenticatedEmail() {
		// Given
		user = new User().setEmail("loggedUser@mail.com");
		SecurityContextHolder.setContext(securityContext);

		when(userRepository.findById(id)).thenReturn(Optional.of(user));

		when(securityContext.getAuthentication()).thenReturn(authentication);

		when(authentication.getPrincipal()).thenReturn(userDetails);

		when(userDetails.getUsername()).thenReturn("loggedUser@mail.com");

		// When
		Optional<Boolean> response = userService.fetchAndDelete(id);

		// Then
		assertThat(response).isNotEmpty();
		assertThat(response.get()).isTrue();
		verify(userRepository, times(1)).findById(id);
		verify(SecurityContextHolder.getContext().getAuthentication(), times(1)).getPrincipal();
		verify(userRepository, times(1)).deleteById(id);
	}

}
