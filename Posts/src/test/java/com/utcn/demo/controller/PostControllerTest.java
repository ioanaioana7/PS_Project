package com.utcn.demo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.utcn.demo.entity.Post;
import com.utcn.demo.service.PostService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PostController.class)
class PostControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PostService postService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getPosts_ReturnsPostList() throws Exception {
        List<Post> posts = new ArrayList<>();
        posts.add(new Post(1L, 100L, "Spring Boot Tips", "Here are some useful Spring Boot tips", LocalDateTime.now(), null, "published"));
        posts.add(new Post(2L, 101L, "Java Best Practices", "Important Java best practices", LocalDateTime.now(), null, "published"));

        when(postService.findAll()).thenReturn(posts);

        mockMvc.perform(get("/post/getPosts")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].title", is("Spring Boot Tips")))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].title", is("Java Best Practices")));

        verify(postService, times(1)).findAll();
    }

    @Test
    void getPosts_Empty_ReturnsEmptyList() throws Exception {
        when(postService.findAll()).thenReturn(new ArrayList<>());

        mockMvc.perform(get("/post/getPosts")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        verify(postService, times(1)).findAll();
    }

    @Test
    void createPost_WithValidPost_ReturnsCreatedPost() throws Exception {
        Post post = new Post(1L, 100L, "Spring Boot Tips", "Here are some useful Spring Boot tips", LocalDateTime.now(), null, "published");

        when(postService.save(any())).thenReturn(post);

        mockMvc.perform(post("/post/createPost")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(post)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is("Spring Boot Tips")))
                .andExpect(jsonPath("$.userID", is(100)));

        verify(postService, times(1)).save(any());
    }

    @Test
    void getPostById_ExistingId_ReturnsPost() throws Exception {
        Post post = new Post(1L, 100L, "Spring Boot Tips", "Here are some useful Spring Boot tips", LocalDateTime.now(), null, "published");

        when(postService.findById(1)).thenReturn(post);

        mockMvc.perform(get("/post/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is("Spring Boot Tips")));

        verify(postService, times(1)).findById(1);
    }

    @Test
    void getPostById_NonExistingId_ReturnsNull() throws Exception {
        when(postService.findById(999)).thenReturn(null);

        mockMvc.perform(get("/post/999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("null"));

        verify(postService, times(1)).findById(999);
    }

    @Test
    void updatePost_ExistingId_ReturnsUpdatedPost() throws Exception {
        Post existingPost = new Post(1L, 100L, "Spring Boot Tips", "Here are some useful Spring Boot tips", LocalDateTime.now(), null, "published");
        Post updatedPost = new Post(1L, 100L, "Updated Spring Boot Tips", "Updated content", LocalDateTime.now(), null, "updated");

        when(postService.findById(1)).thenReturn(existingPost);
        when(postService.save(any())).thenReturn(updatedPost);

        mockMvc.perform(put("/post/update/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedPost)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is("Updated Spring Boot Tips")));

        verify(postService, times(1)).findById(1);
        verify(postService, times(1)).save(any());
    }

    @Test
    void updatePost_NonExistingId_ReturnsNull() throws Exception {
        when(postService.findById(999)).thenReturn(null);

        mockMvc.perform(put("/post/update/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isOk())
                .andExpect(content().string("null"));

        verify(postService, times(1)).findById(999);
    }

    @Test
    void deletePost_ExistingId_DeletesAndReturnsOk() throws Exception {
        Post post = new Post(1L, 100L, "Spring Boot Tips", "Here are some useful Spring Boot tips", LocalDateTime.now(), null, "published");

        when(postService.findById(1)).thenReturn(post);
        doNothing().when(postService).delete(any());

        mockMvc.perform(delete("/post/delete/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(postService, times(1)).findById(1);
        verify(postService, times(1)).delete(any());
    }

    @Test
    void deletePost_NonExistingId_ReturnsOkWithoutDelete() throws Exception {
        when(postService.findById(999)).thenReturn(null);

        mockMvc.perform(delete("/post/delete/999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(postService, times(1)).findById(999);
        verify(postService, never()).delete(any());
    }
}
