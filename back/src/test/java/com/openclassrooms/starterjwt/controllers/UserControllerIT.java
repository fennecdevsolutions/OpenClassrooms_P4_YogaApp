package com.openclassrooms.starterjwt.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test") // allows for test using in memory H2 database
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Transactional
@DisplayName("User Controller Integration Test")
class UserControllerIT {
	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	private String token;

	@BeforeAll
	void setupToken() throws Exception {
		LoginRequest loginRequest = new LoginRequest();
		loginRequest.setEmail("user1@test.com");
		loginRequest.setPassword("password");

		String response = mockMvc
				.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest)))
				.andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

		JsonNode jsonNode = objectMapper.readTree(response);
		token = jsonNode.get("token").asText();
	}

	@Test
	@DisplayName("Should get user by Id")
	void findById_shouldReturnUserInSuccessResponseBody_whenFoundById() throws Exception {
		mockMvc.perform(get("/api/user/1").header("Authorization", "Bearer " + token)).andExpect(status().isOk())
				.andExpect(jsonPath(".id").value(1)).andExpect(jsonPath(".firstName").value("John"))
				.andExpect(jsonPath(".lastName").value("Doe")).andExpect(jsonPath(".email").value("user1@test.com"))
				.andExpect(jsonPath(".admin").value(false));

	}

	@Test
	@DisplayName("Should return NotFound response when user is not found by Id")
	void findById_shouldReturnNotFoundResponse_whenUserNotFoundById() throws Exception {
		mockMvc.perform(get("/api/user/100").header("Authorization", "Bearer " + token))
				.andExpect(status().isNotFound());
	}

	@Test
	@DisplayName("Should return NotFound response when user to delete is not found by Id")
	void delete_shouldReturnNotFoundResponse_whenUserNotFoundById() throws Exception {
		mockMvc.perform(delete("/api/user/100").header("Authorization", "Bearer " + token))
				.andExpect(status().isNotFound());
	}

	@Test
	@DisplayName("Should return Unauthorised response when user to delete is not the authenticated user")
	void delete_shouldReturnUnauthorisedResponse_whenUserToDeleteIsDifferentThanAuthenticatedUser() throws Exception {
		mockMvc.perform(delete("/api/user/2").header("Authorization", "Bearer " + token))
				.andExpect(status().isUnauthorized());
	}

	@Test
	@DisplayName("Should return NotFound response when user to delete is not found by Id")
	void delete_shouldReturnSuccessResponse_whenUserIsDeletedById() throws Exception {
		// Delete user 1
		mockMvc.perform(delete("/api/user/1").header("Authorization", "Bearer " + token)).andExpect(status().isOk());

		// Login as user 2
		LoginRequest loginRequest = new LoginRequest();
		loginRequest.setEmail("user2@test.com");
		loginRequest.setPassword("password");

		String response = mockMvc
				.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest)))
				.andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

		JsonNode jsonNode = objectMapper.readTree(response);
		token = jsonNode.get("token").asText();

		// check user1 is not found
		mockMvc.perform(get("/api/user/1").header("Authorization", "Bearer " + token)).andExpect(status().isNotFound());
	}

}
