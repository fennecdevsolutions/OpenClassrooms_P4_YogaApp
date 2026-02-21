package com.openclassrooms.starterjwt.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class SessionServiceTest {

	@Mock
	private UserRepository userRepository;

	@Mock
	private SessionRepository sessionRepository;

	@InjectMocks
	public SessionService sessionService;

	private Long id;
	private User user1;
	private User user2;
	private Session testSession;

	@BeforeEach
	void setUp() {
		id = 1L;
		user1 = new User().setId(5L);
		user2 = new User().setId(7L);
		testSession = Session.builder().id(id).name("Yoga Session").date(new Date())
				.description("Advanced level session")
				.teacher(new Teacher().setId(2L).setFirstName("Teacher").setLastName("McTeacher"))
				.users(List.of(user1, user2)).build();
	}

	@Test
	@DisplayName("Should return created session")
	void create_shouldReturnCreatedSession_WhenCreationIsComplete() {
		// Given
		when(sessionRepository.save(testSession)).thenReturn(testSession);

		// When
		Session createdSession = sessionService.create(testSession);

		// Then
		assertThat(createdSession).isNotNull();
		assertThat(createdSession).usingRecursiveComparison().isEqualTo(testSession);
		verify(sessionRepository, times(1)).save(testSession);

	}

	@Test
	@DisplayName("Should call session repository delete by ID")
	void delete_shouldCallRepositoryDeleteById() {
		// Given

		// When
		sessionService.delete(id);

		// Then

		verify(sessionRepository, times(1)).deleteById(id);

	}

	@Test
	@DisplayName("Should fetch session by ID and delete it then return True")
	void fethcAndDelete_shouldFetchSessionById_thenDeleteSessionAndReturnTrue() {
		// Given
		when(sessionRepository.findById(id)).thenReturn(Optional.ofNullable(testSession));

		// When
		boolean response = sessionService.fetchAnddelete(id);

		// Then
		assertThat(response).isTrue();
		verify(sessionRepository, times(1)).findById(id);
		verify(sessionRepository, times(1)).deleteById(id);

	}

	@Test
	@DisplayName("Should fetch session by ID and return false when not found")
	void fethcAndDelete_shouldFetchSessionById_thenReturnFalseWhenNotFound() {
		// Given
		when(sessionRepository.findById(id)).thenReturn(Optional.empty());

		// When
		boolean response = sessionService.fetchAnddelete(id);

		// Then
		assertThat(response).isFalse();
		verify(sessionRepository, times(1)).findById(id);
		verify(sessionRepository, never()).deleteById(id);

	}

	@Test
	@DisplayName("Should return the list of all existing sessions")
	void findAll_souldReturnTheListOfAllSessions() {
		// Given
		Session testSession2 = testSession;
		when(sessionRepository.findAll()).thenReturn(List.of(testSession, testSession2.setId(2L)));
		// When
		List<Session> sessions = sessionService.findAll();

		// Then
		assertThat(sessions).isNotEmpty();
		assertThat(sessions.get(0)).usingRecursiveComparison().isEqualTo(testSession);
		assertThat(sessions.get(1)).usingRecursiveComparison().isEqualTo(testSession2);
		verify(sessionRepository, times(1)).findAll();

	}

	@Test
	@DisplayName("Should return the updated session")
	void update_souldUpdateTheSessionById_ThenReturnUpToDateSession() {
		// Given
		Session updatedSession = testSession;
		updatedSession.setName("Up To Date Session Name");
		when(sessionRepository.save(updatedSession)).thenReturn(updatedSession);
		// When
		Session session = sessionService.update(id, testSession);

		// Then
		assertThat(session).isNotNull();
		assertThat(session).usingRecursiveComparison().isEqualTo(updatedSession);
		verify(sessionRepository, times(1)).save(testSession);

	}

	@Nested
	@DisplayName("Participation Scenarios")
	class ParticipationTests {
		private User newParticipatingUser = new User().setId(1L);

		@Test
		@DisplayName("Participate: Should add user participation after checks")
		void participate_souldCheckUserParticipation_ThenAddUserToSessionParticipationList() {
			// Given
			testSession.setUsers(new ArrayList<>(List.of(user1, user2)));
			when(sessionRepository.findById(id)).thenReturn(Optional.ofNullable(testSession));
			when(userRepository.findById(1L)).thenReturn(Optional.ofNullable(newParticipatingUser));
			when(sessionRepository.save(testSession)).thenReturn(testSession);
			// When
			sessionService.participate(id, newParticipatingUser.getId());

			// Then
			assertThat(testSession.getUsers()).contains(user1, user2, newParticipatingUser);
			assertThat(testSession.getUsers().getLast().getId()).isEqualTo(newParticipatingUser.getId());
			verify(sessionRepository, times(1)).save(testSession);
			verify(sessionRepository, times(1)).findById(id);
			verify(userRepository, times(1)).findById(1L);

		}

		@Test
		@DisplayName("Participate: Should throw NotFoundException when user is not found")
		void participate_souldReturnNotFoundException_whenUserNotFound() {
			// Given

			when(sessionRepository.findById(id)).thenReturn(Optional.ofNullable(testSession));
			when(userRepository.findById(1L)).thenReturn(Optional.empty());

			// When
			assertThrows(NotFoundException.class, () -> {
				sessionService.participate(id, newParticipatingUser.getId());
			});

			// Then
			verify(sessionRepository, never()).save(testSession);
			verify(sessionRepository, times(1)).findById(id);
			verify(userRepository, times(1)).findById(1L);

		}

		@Test
		@DisplayName("Participate: Should throw NotFoundException when session is not found")
		void participate_souldReturnNotFoundException_whenSessionNotFound() {
			// Given

			when(sessionRepository.findById(id)).thenReturn(Optional.empty());
			when(userRepository.findById(1L)).thenReturn(Optional.ofNullable(newParticipatingUser));

			// When
			assertThrows(NotFoundException.class, () -> {
				sessionService.participate(id, newParticipatingUser.getId());
			});

			// Then
			verify(sessionRepository, never()).save(testSession);
			verify(sessionRepository, times(1)).findById(id);
			verify(userRepository, times(1)).findById(1L);

		}

		@Test
		@DisplayName("Participate: Should throw BadRequestException when user is already participating")
		void participate_shouldReturnBadRequestException_whenUserInList() {
			// Given

			when(sessionRepository.findById(id)).thenReturn(Optional.ofNullable(testSession));
			when(userRepository.findById(5L)).thenReturn(Optional.of(user1));

			// When
			assertThrows(BadRequestException.class, () -> {
				sessionService.participate(id, user1.getId());
			});

			// Then
			verify(sessionRepository, never()).save(testSession);
			verify(sessionRepository, times(1)).findById(id);
			verify(userRepository, times(1)).findById(5L);

		}

		@Test
		@DisplayName("noLongerParticipate: Should throw BadRequestException when user is already participating")
		void noLongerparticipate_shouldReturnBadRequestException_whenUserNotInList() {
			// Given

			when(sessionRepository.findById(id)).thenReturn(Optional.ofNullable(testSession));
			// When
			assertThrows(BadRequestException.class, () -> {
				sessionService.noLongerParticipate(id, newParticipatingUser.getId());
			});

			// Then
			verify(sessionRepository, never()).save(testSession);
			verify(sessionRepository, times(1)).findById(id);

		}

		@Test
		@DisplayName("noLongerParticipate: Should throw NotFoundException when session is not found")
		void noLongerparticipate_shouldReturnNotFoundException_whenSessionNotFound() {
			// Given

			when(sessionRepository.findById(id)).thenReturn(Optional.empty());
			// When
			assertThrows(NotFoundException.class, () -> {
				sessionService.noLongerParticipate(id, user1.getId());
			});

			// Then
			verify(sessionRepository, never()).save(testSession);
			verify(sessionRepository, times(1)).findById(id);

		}

		@Test
		@DisplayName("noLongerParticipate: Should remove user from participation list")
		void noLongerparticipate_shouldRemoveUserFromList_whenUserIsParticipating() {
			// Given

			when(sessionRepository.findById(id)).thenReturn(Optional.ofNullable(testSession));
			// When

			sessionService.noLongerParticipate(id, user1.getId());

			// Then
			assertThat(testSession.getUsers()).containsExactly(user2);
			verify(sessionRepository, times(1)).save(testSession);
			verify(sessionRepository, times(1)).findById(id);

		}
	}

}
