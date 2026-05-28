package com.utcn.demo.service;

import com.utcn.demo.entity.User;
import com.utcn.demo.messages.EmailMessage;
import com.utcn.demo.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;

    @Autowired private PasswordEncoder passwordEncoder;

    public List<User> findAll() {
        List<User> users = (List<User>) userRepository.findAll();
        return users;
    }

    public User findById(int id) {
        Optional<User> user = userRepository.findById(Long.valueOf(id));
        if (user.isPresent()) {
            return user.get();
        }
        return null;
    }

    public User login(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
        }
        return null;
    }

    public boolean isBanned(User user) {
        return user.isBanned();
    }

    public boolean changeUserBanStatus(long userID, boolean banStatus) {
        Optional<User> user = userRepository.findById(userID);
        if (user.isPresent()) {
            User u = user.get();
            if (u.isBanned() != banStatus) {
                if (banStatus == true) {
                    try {
                        Map<String, String> requestBody = new HashMap<>();
                        requestBody.put("phone", u.getPhone());
                        requestBody.put(
                                "message",
                                """
                                    Dear User,

                                    We are sorry to inform you that you were banned.
                                """);
                        RestTemplate restTemplate = new RestTemplate();
                        restTemplate.postForObject(
                                "http://localhost:3000/send-message", requestBody, Map.class);
                        EmailMessage.sendEmail(
                                u.getEmail(),
                                """
                                Dear User,

                                We are sorry to inform you that you were banned.
                                """);
                    } catch (Exception e) {

                        System.out.println(e.getMessage());
                    }
                    u.setBanned(true);
                } else {
                    try {
                        Map<String, String> requestBody = new HashMap<>();
                        requestBody.put("phone", u.getPhone());
                        requestBody.put(
                                "message",
                                """
                                    Dear User,

                                    We are happy to inform you that you have just been unbanned.
                                """);
                        RestTemplate restTemplate = new RestTemplate();
                        restTemplate.postForObject(
                                "http://localhost:3000/send-message", requestBody, Map.class);
                        EmailMessage.sendEmail(
                                u.getEmail(),
                                """
                                Dear User,

                                We are happy to inform you that you have just been unbanned.
                                """);
                    } catch (Exception e) {
                        System.out.println("Email coudnt be send");
                    }
                    u.setBanned(false);
                }
                userRepository.save(u);
            }
            return true;
        }
        return false;
    }

    public int updateScore(Long userID, float score) {
        return userRepository.updateScoreByUserID(score, userID);
    }

    public User save(User user) {
        // Only encrypt password if it's not already encrypted (raw password won't start with $2a$)
        if (user.getPassword() != null && !user.getPassword().isEmpty() && !user.getPassword().startsWith("$2a$")) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }

    public void delete(User user) {
        userRepository.delete(user);
    }
}
