package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    
    public ResponseEntity<?> deleteUser(Long id) {
    	User user = this.findById(Long.valueOf(id));

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!Objects.equals(userDetails.getUsername(), user.getEmail())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        this.userRepository.deleteById(id);
        return ResponseEntity.ok().build();
        
    }
    

    public ResponseEntity<?> findByIdResponse(Long id) {
    	User user = this.findById(Long.valueOf(id));

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().body(this.userMapper.toDto(user));
    }
    
    
    public User findById(Long id) {
        return this.userRepository.findById(id).orElse(null);
    }
    }

