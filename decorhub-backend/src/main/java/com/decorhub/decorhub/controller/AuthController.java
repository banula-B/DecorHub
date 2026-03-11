package com.decorhub.decorhub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.decorhub.decorhub.entity.User;
import com.decorhub.decorhub.service.UserService;

@RestController
@CrossOrigin
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    UserService userService;

    @PostMapping("/signup")
    public User signup(@RequestBody User user){
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody User user){

        return userService.loginUser(user.getEmail(), user.getPassword());
    }

}