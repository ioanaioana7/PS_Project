package com.utcn.demo.service;

import com.utcn.demo.entity.User;
import com.utcn.demo.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void findAll_ReturnsUserList() {
        List<User> users = new ArrayList<>();
        users.add(new User(1L, "Alice", "alice@example.com", true, "pass1"));
        users.add(new User(2L, "Bob", "bob@example.com", false, "pass2"));

        when(userRepository.findAll()).thenReturn(users);

        List<User> result = userService.findAll();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Alice", result.get(0).getName());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void findById_ExistingId_ReturnsUser() {
        User user = new User(42L, "Charlie", "charlie@example.com", false, "pass42");
        when(userRepository.findById(42L)).thenReturn(Optional.of(user));

        User result = userService.findById(42);

        assertNotNull(result);
        assertEquals("Charlie", result.getName());
        verify(userRepository, times(1)).findById(42L);
    }

    @Test
    void findById_NonExistingId_ReturnsNull() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        User result = userService.findById(99);

        assertNull(result);
        verify(userRepository, times(1)).findById(99L);
    }

    @Test
    void save_CallsRepositoryAndReturnsSaved() {
        User user = new User(null, "David", "david@example.com", true, "pass4");
        User saved = new User(100L, "David", "david@example.com", true, "pass4");

        when(userRepository.save(user)).thenReturn(saved);

        User result = userService.save(user);

        assertNotNull(result);
        assertEquals(100L, result.getId());
        assertEquals("David", result.getName());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void delete_CallsRepositoryDelete() {
        User user = new User(10L, "Eve", "eve@example.com", false, "pass10");

        doNothing().when(userRepository).delete(user);

        userService.delete(user);

        verify(userRepository, times(1)).delete(user);
    }
}
