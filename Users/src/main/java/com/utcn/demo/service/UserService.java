package com.utcn.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.utcn.demo.entity.User;
import com.utcn.demo.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> findAll() {
        List<User> users = (List<User>) userRepository.findAll();
        return users;
    }

    public User findById(int id) {
        Optional<User> user = userRepository.findById(Long.valueOf(id));
        if(user.isPresent()){
            return user.get();
        }
        return null;
    }

    public User save(User user) {
        // Encrypt password
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }

    public void delete(User user) {
        userRepository.delete(user);
    }

}
