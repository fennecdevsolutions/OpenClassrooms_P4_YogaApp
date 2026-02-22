package com.openclassrooms.starterjwt.controllers;

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

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test") // allows for test using in memory H2 database
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@DisplayName("Teacher Controller Integration Test")
class TeacherControllerIT {

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
	@DisplayName("Should get all teachers list")
	void findAll_shouldReturnAllTeachersInSuccessResponseBody() throws Exception {
		mockMvc.perform(get("/api/teacher").header("Authorization", "Bearer " + token)).andExpect(status().isOk())
				.andExpect(jsonPath("$.length()").value(4)).andExpect(jsonPath("[0].firstName").value("Teacher1"))
				.andExpect(jsonPath("[0].lastName").value("McTeacher"))
				.andExpect(jsonPath("[1].firstName").value("Teacher2"))
				.andExpect(jsonPath("[2].firstName").value("Teacher3"))
				.andExpect(jsonPath("[3].firstName").value("Teacher4"))
				.andExpect(jsonPath("[3].lastName").value("McAvailable"));

	}

	@Test
	@DisplayName("Should get teacher by Id")
	void findById_shouldReturnTeacherInSuccessResponseBody_whenFoundById() throws Exception {
		mockMvc.perform(get("/api/teacher/1").header("Authorization", "Bearer " + token)).andExpect(status().isOk())
				.andExpect(jsonPath(".id").value(1)).andExpect(jsonPath(".firstName").value("Teacher1"))
				.andExpect(jsonPath(".lastName").value("McTeacher"));

	}

	@Test
	@DisplayName("Should return not found response when teacher is not found by Id")
	void findById_shouldReturnNotFoundResponse_whenTeacherNotFoundById() throws Exception {
		mockMvc.perform(get("/api/teacher/100").header("Authorization", "Bearer " + token))
				.andExpect(status().isNotFound());

	}

}
