package com.openclassrooms.starterjwt.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test") // allows for test using in memory H2 database
@Transactional // reset database between tests.
@DisplayName("Auth Controller Integration Test")
class AuthControllerIT {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Test
	@DisplayName("Should return success response with jwt response in body containing token and user details")
	void authenticateUser_shouldReturnSuccessResponseWithTokenAndUserDetails_whenUserIsAuthenticated()
			throws Exception {
		LoginRequest loginRequest = new LoginRequest();
		loginRequest.setEmail("user1@test.com");
		loginRequest.setPassword("password");

		mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(loginRequest))).andExpect(status().isOk())
				.andExpect(jsonPath("$.token").exists()).andExpect(jsonPath("$.id").value(1))
				.andExpect(jsonPath("$.username").value("user1@test.com"))
				.andExpect(jsonPath("$.firstName").value("John")).andExpect(jsonPath("$.lastName").value("Doe"));

	}

	@Test
	@DisplayName("Should return success response with success message in body when user is registered")
	void registerUser_shouldReturnSuccessResponseWithSuccessMessage_whenUserIsRegistered() throws Exception {
		SignupRequest signupRequest = new SignupRequest();
		signupRequest.setEmail("yoga1998@test.com");
		signupRequest.setPassword("password");
		signupRequest.setFirstName("Yooo");
		signupRequest.setLastName("Gaaa");

		mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(signupRequest))).andExpect(status().isOk())
				.andExpect(jsonPath("$.message").value("User registered successfully!"));

	}

	@Test
	@DisplayName("Should return bad request response with email taken message in body when user already exists")
	void registerUser_shouldReturnBadRequestResponseWithEmailExistsMessage_whenUserAlreadyExists() throws Exception {
		SignupRequest signupRequest = new SignupRequest();
		signupRequest.setEmail("user2@test.com");
		signupRequest.setPassword("password");
		signupRequest.setFirstName("Yooo");
		signupRequest.setLastName("Gaaa");

		mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(signupRequest))).andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Error: Email is already taken!"));

	}

}
