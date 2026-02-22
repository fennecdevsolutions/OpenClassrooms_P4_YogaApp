package com.openclassrooms.starterjwt.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Date;

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
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test") // allows for test using in memory H2 database
@Transactional // reset database between tests.
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@DisplayName("Session Controller Integration Test")
class SessionControllerIT {

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
	@DisplayName("Should return success response with Session Easy Yoga in body")
	void findById_shouldReturnSessionInSuccessResponseBody_whenSessionIsFoundById() throws Exception {
		mockMvc.perform(get("/api/session/1").header("Authorization", "Bearer " + token)).andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Easy Yoga"));

	}

	@Test
	@DisplayName("Should return not found response ")
	void findById_shouldReturnNotFoundResponse_whenSessionIsNotFound() throws Exception {
		mockMvc.perform(get("/api/session/100").header("Authorization", "Bearer " + token))
				.andExpect(status().isNotFound());

	}

	@Test
	@DisplayName("Should return success response with All session in body")
	void findAll_shouldReturnAllSessionInSuccessResponseBody() throws Exception {
		mockMvc.perform(get("/api/session").header("Authorization", "Bearer " + token)).andExpect(status().isOk())
				.andExpect(jsonPath("$[0].name").value("Easy Yoga")).andExpect(jsonPath("$[1].name").value("Hard Yoga"))
				.andExpect(jsonPath("$[2].name").value("Extreme Yoga"));
		;

	}

	@Test
	@DisplayName("Should return success response with created session in body")
	void create_shouldReturnCreatedSessionInSuccessResponseBody() throws Exception {
		SessionDto sessionToCreate = new SessionDto();
		sessionToCreate.setName("New Session");
		sessionToCreate.setDescription("A new modern easy session");
		sessionToCreate.setDate(new Date());
		sessionToCreate.setTeacher_id(4L);

		mockMvc.perform(post("/api/session").header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(sessionToCreate)))
				.andExpect(status().isOk()).andExpect(jsonPath("$.name").value("New Session"));
		mockMvc.perform(get("/api/session").header("Authorization", "Bearer " + token)).andExpect(status().isOk())
				.andExpect(jsonPath("$.length()").value(4)).andExpect(jsonPath("$[3].name").value("New Session"));

	}

	@Test
	@DisplayName("Should return success response with updated session in body")
	void update_shouldReturnUpdatedSessionInSuccessResponseBody() throws Exception {
		SessionDto updatedSession = new SessionDto();
		updatedSession.setName("Updated Session");
		updatedSession.setDescription("A polished session");
		updatedSession.setDate(new Date());
		updatedSession.setTeacher_id(4L);

		mockMvc.perform(put("/api/session/1").header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(updatedSession)))
				.andExpect(status().isOk()).andExpect(jsonPath("$.name").value("Updated Session"));
		mockMvc.perform(get("/api/session/1").header("Authorization", "Bearer " + token)).andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Updated Session"));

	}

	@Test
	@DisplayName("Should return success response and delete session when found by Id")
	void delete_shouldDeleteSessionAndReturnEmptySuccessResponseBody_whenSessionIsFoundById() throws Exception {

		mockMvc.perform(delete("/api/session/2").header("Authorization", "Bearer " + token)).andExpect(status().isOk());
		mockMvc.perform(get("/api/session").header("Authorization", "Bearer " + token)).andExpect(status().isOk())
				.andExpect(jsonPath("$.length()").value(2));
		mockMvc.perform(get("/api/session/2").header("Authorization", "Bearer " + token))
				.andExpect(status().isNotFound());

	}

	@Test
	@DisplayName("Should return not found response when session to delete is not found by Id")
	void delete_shouldReturnNotFoundResponse_whenSessionIsNotFoundById() throws Exception {

		mockMvc.perform(delete("/api/session/100").header("Authorization", "Bearer " + token))
				.andExpect(status().isNotFound());

	}

	@Test
	@DisplayName("Should add user to the session participation list")
	void participate_shouldReturnSuccessResponse_whenUserIsAddedToParticipationList() throws Exception {

		mockMvc.perform(post("/api/session/1/participate/1").header("Authorization", "Bearer " + token))
				.andExpect(status().isOk());
		mockMvc.perform(get("/api/session/1").header("Authorization", "Bearer " + token)).andExpect(status().isOk())
				.andExpect(jsonPath("$.users.length()").value(1)).andExpect(jsonPath("$.users[0]").value(1));

	}

	@Test
	@DisplayName("Should remove user from participation list")
	void noLongerParticipate_shouldReturnSuccessResponse_whenUserIsRemovedFromParticipationList() throws Exception {
		mockMvc.perform(get("/api/session/3").header("Authorization", "Bearer " + token)).andExpect(status().isOk())
				.andExpect(jsonPath("$.users.length()").value(1)).andExpect(jsonPath("$.users[0]").value(2));
		mockMvc.perform(delete("/api/session/3/participate/2").header("Authorization", "Bearer " + token))
				.andExpect(status().isOk());
		mockMvc.perform(get("/api/session/3").header("Authorization", "Bearer " + token)).andExpect(status().isOk())
				.andExpect(jsonPath("$.users").isEmpty());

	}

}
