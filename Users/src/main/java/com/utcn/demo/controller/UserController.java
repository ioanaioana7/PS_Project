package com.utcn.demo.controller;

import com.utcn.demo.entity.User;
import com.utcn.demo.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired private UserService userService;

    @GetMapping("/getusers")
    public List<User> getProducts() {
        return userService.findAll();
    }

    @PostMapping("/createusers")
    public User addProduct(@RequestBody User user) {
        return userService.save(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        User user = userService.login(email, password);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    @PostMapping("/score/{userID}")
    public ResponseEntity<String> updateScore(@PathVariable Long userID, @RequestParam float score) {
        int worked = userService.updateScore(userID, score);
        if (worked != 0) {
            return ResponseEntity.ok("The user score was updated");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @GetMapping("/{id}")
    public User getUserByID(@PathVariable int id) {
        return userService.findById(id);
    }

    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable int id, @RequestBody User user) {
        User existingUser = userService.findById(id);
        if (existingUser != null) {
            existingUser.setName(user.getName());
            existingUser.setEmail(user.getEmail());
            return userService.save(existingUser);
        }
        return null;
    }

    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable int id) {
        User user = userService.findById(id);
        if (user != null) {
            userService.delete(user);
        }
    }
}
