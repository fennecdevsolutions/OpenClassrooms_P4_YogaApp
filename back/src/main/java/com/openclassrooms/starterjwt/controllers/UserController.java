package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;


    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable("id") String id) {
       return userService.findByIdResponse(Long.parseLong(id));
        }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteUser(@PathVariable("id") String id) {
    	return userService.deleteUser(Long.parseLong(id));
        }
}
