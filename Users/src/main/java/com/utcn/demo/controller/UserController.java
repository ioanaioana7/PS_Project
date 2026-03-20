package com.utcn.demo.controller;

import com.utcn.demo.entity.User;
import com.utcn.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/getusers")
    public List<User> getProducts() {
        return userService.findAll();
    }

    @PostMapping("/createusers")
    public User addProduct(@RequestBody User user) {
        return userService.save(user);
    }
}
