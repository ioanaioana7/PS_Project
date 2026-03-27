package com.utcn.demo.controller;

import com.utcn.demo.entity.User;
import com.utcn.demo.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    @Test
    void getProducts_ReturnsAllUsers() {
        User a = new User(1L, "Alice", "alice@example.com", true, "pass1");
        User b = new User(2L, "Bob", "bob@example.com", false, "pass2");
        when(userService.findAll()).thenReturn(Arrays.asList(a, b));

        List<User> result = userController.getProducts();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Alice", result.get(0).getName());
        verify(userService, times(1)).findAll();
    }

    @Test
    void getUserByID_ReturnsUser() {
        User user = new User(5L, "Carol", "carol@example.com", false, "pass5");
        when(userService.findById(5)).thenReturn(user);

        User result = userController.getUserByID(5);

        assertNotNull(result);
        assertEquals("Carol", result.getName());
        verify(userService, times(1)).findById(5);
    }

    @Test
    void addProduct_ReturnsSavedUser() {
        User user = new User(null, "Dan", "dan@example.com", true, "pass6");
        User saved = new User(6L, "Dan", "dan@example.com", true, "pass6");
        when(userService.save(any(User.class))).thenReturn(saved);

        User result = userController.addProduct(user);

        assertNotNull(result);
        assertEquals(6L, result.getId());
        verify(userService, times(1)).save(user);
    }

    @Test
    void updateUser_ExistingUser_ReturnsUpdated() {
        User existing = new User(7L, "Eve", "old@example.com", false, "pass7");
        User update = new User(null, "Eve", "new@example.com", false, "pass7");
        when(userService.findById(7)).thenReturn(existing);
        when(userService.save(any(User.class))).thenReturn(new User(7L, "Eve", "new@example.com", false, "pass7"));

        User result = userController.updateUser(7, update);

        assertNotNull(result);
        assertEquals("new@example.com", result.getEmail());
        verify(userService, times(1)).findById(7);
        verify(userService, times(1)).save(existing);
    }

    @Test
    void deleteUser_ExistingUser_CallsDelete() {
        User existing = new User(8L, "Fred", "fred@example.com", true, "pass8");
        when(userService.findById(8)).thenReturn(existing);

        userController.deleteUser(8);

        verify(userService, times(1)).findById(8);
        verify(userService, times(1)).delete(existing);
    }
}
