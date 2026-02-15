package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherService {

    private final TeacherMapper teacherMapper;
    private final TeacherRepository teacherRepository;

    public TeacherService(TeacherRepository teacherRepository, TeacherMapper teacherMapper) {
        this.teacherRepository = teacherRepository;
        this.teacherMapper = teacherMapper;
    }

    public List<Teacher> findAll() {
        return this.teacherRepository.findAll();
    }

    public ResponseEntity<?> findByIdResponse(Long id) {
    	Teacher teacher = this.findById(id);

        if (teacher == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().body(this.teacherMapper.toDto(teacher));
    	
    }
    
    public Teacher findById (Long id) {
    	return teacherRepository.findById(id).orElse(null);
    }
}
