package com.decorhub.decorhub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.decorhub.decorhub.entity.User;
import com.decorhub.decorhub.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    public User registerUser(User user){
        return userRepository.save(user);
    }

    public User loginUser(String email, String password){

        User user = userRepository.findByEmail(email);

        if(user != null && user.getPassword().equals(password)){
            return user;
        }

        return null;
    }

}