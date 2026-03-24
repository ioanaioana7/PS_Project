package com.utcn.demo.service;

import com.utcn.demo.entity.User;
import com.utcn.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

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
        return userRepository.save(user);
    }

    public void delete(User user) {
        userRepository.delete(user);
    }

}
