package com.openclassrooms.starterjwt.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("Techer Service Tests")
class TeacherServiceTest {

	@Mock
	TeacherRepository teacherRepository;

	@InjectMocks
	private TeacherService teacherService;

	private Teacher teacher1;
	private Teacher teacher2;

	@BeforeEach
	void setUp() {
		teacher1 = Teacher.builder().id(1L).firstName("Jonh").lastName("Doe").build();
		teacher2 = Teacher.builder().id(2L).firstName("Jane").lastName("McTeacher").build();
	}

	@Test
	@DisplayName("Should return the list of all teachers")
	void findAll_shouldReturnListOfAllTeachers() {
		// Given
		when(teacherRepository.findAll()).thenReturn(List.of(teacher1, teacher2));

		// When
		List<Teacher> returnedList = teacherService.findAll();

		// Then
		assertThat(returnedList).isNotEmpty();
		assertThat(returnedList).containsExactly(teacher1, teacher2);
		verify(teacherRepository, times(1)).findAll();

	}

	@Test
	@DisplayName("Should return teacher when teacher is found by Id")
	void findById_shouldReturnTeacher_whenFoundById() {
		// Given
		when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher1));

		// When
		Teacher returnedTeacher = teacherService.findById(1L);

		// Then
		assertThat(returnedTeacher).isNotNull();
		assertThat(returnedTeacher).usingRecursiveComparison().isEqualTo(teacher1);
		verify(teacherRepository, times(1)).findById(1L);

	}

}
