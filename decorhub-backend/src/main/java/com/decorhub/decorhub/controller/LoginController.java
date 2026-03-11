package com.decorhub.decorhub.controller;

import com.decorhub.decorhub.entity.User;
import com.decorhub.decorhub.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
public class LoginController {

    private final UserRepository userRepository;

    public LoginController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping
    public String login(@RequestParam String email, @RequestParam String password, HttpSession session) {
        User user = userRepository.findByEmail(email);
        if (user == null) return "User not found";

        if (!user.getPassword().equals(password)) return "Wrong password";

        // Store user in session
        session.setAttribute("user", user);

        if ("ADMIN".equals(user.getRole())) {
            return "redirect:/admin/dashboard";
        } else {
            return "redirect:/user/dashboard";
        }
    }
}