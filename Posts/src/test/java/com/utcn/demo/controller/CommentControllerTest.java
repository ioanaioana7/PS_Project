package com.utcn.demo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.utcn.demo.entity.Comment;
import com.utcn.demo.entity.Post;
import com.utcn.demo.service.CommentService;
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

@WebMvcTest(CommentController.class)
class CommentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CommentService commentService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getComments_ReturnsCommentList() throws Exception {
        Post post = new Post(1L, 100L, "Test Post", "Test Content", LocalDateTime.now(), null, null);
        List<Comment> comments = new ArrayList<>();
        comments.add(new Comment(1L, 1, "Great post!", null, LocalDateTime.now(), post));
        comments.add(new Comment(2L, 2, "Thanks for sharing", null, LocalDateTime.now(), post));

        when(commentService.findAll()).thenReturn(comments);

        mockMvc.perform(get("/comment/getComments")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].content", is("Great post!")))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].content", is("Thanks for sharing")));

        verify(commentService, times(1)).findAll();
    }

    @Test
    void getComments_Empty_ReturnsEmptyList() throws Exception {
        when(commentService.findAll()).thenReturn(new ArrayList<>());

        mockMvc.perform(get("/comment/getComments")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        verify(commentService, times(1)).findAll();
    }

    @Test
    void createComment_WithValidComment_ReturnsCreatedComment() throws Exception {
        Post post = new Post(1L, 100L, "Test Post", "Test Content", LocalDateTime.now(), null, null);
        Comment comment = new Comment(1L, 1, "Great post!", null, LocalDateTime.now(), post);

        when(commentService.save(any())).thenReturn(comment);

        mockMvc.perform(post("/comment/createComment")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(comment)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.content", is("Great post!")))
                .andExpect(jsonPath("$.userID", is(1)));

        verify(commentService, times(1)).save(any());
    }

    @Test
    void getCommentById_ExistingId_ReturnsComment() throws Exception {
        Post post = new Post(1L, 100L, "Test Post", "Test Content", LocalDateTime.now(), null, null);
        Comment comment = new Comment(1L, 1, "Great post!", null, LocalDateTime.now(), post);

        when(commentService.findById(1)).thenReturn(comment);

        mockMvc.perform(get("/comment/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.content", is("Great post!")));

        verify(commentService, times(1)).findById(1);
    }

    @Test
    void getCommentById_NonExistingId_ReturnsNull() throws Exception {
        when(commentService.findById(999)).thenReturn(null);

        mockMvc.perform(get("/comment/999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("null"));

        verify(commentService, times(1)).findById(999);
    }

    @Test
    void updateComment_ExistingId_ReturnsUpdatedComment() throws Exception {
        Post post = new Post(1L, 100L, "Test Post", "Test Content", LocalDateTime.now(), null, null);
        Comment existingComment = new Comment(1L, 1, "Great post!", null, LocalDateTime.now(), post);
        Comment updatedComment = new Comment(1L, 1, "Updated comment", null, LocalDateTime.now(), post);

        when(commentService.findById(1)).thenReturn(existingComment);
        when(commentService.save(any())).thenReturn(updatedComment);

        mockMvc.perform(put("/comment/update/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedComment)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.content", is("Updated comment")));

        verify(commentService, times(1)).findById(1);
        verify(commentService, times(1)).save(any());
    }

    @Test
    void updateComment_NonExistingId_ReturnsNull() throws Exception {
        when(commentService.findById(999)).thenReturn(null);

        mockMvc.perform(put("/comment/update/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isOk())
                .andExpect(content().string("null"));

        verify(commentService, times(1)).findById(999);
    }

    @Test
    void deleteComment_ExistingId_DeletesAndReturnsOk() throws Exception {
        Post post = new Post(1L, 100L, "Test Post", "Test Content", LocalDateTime.now(), null, null);
        Comment comment = new Comment(1L, 1, "Great post!", null, LocalDateTime.now(), post);

        when(commentService.findById(1)).thenReturn(comment);
        doNothing().when(commentService).delete(any());

        mockMvc.perform(delete("/comment/delete/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(commentService, times(1)).findById(1);
        verify(commentService, times(1)).delete(any());
    }

    @Test
    void deleteComment_NonExistingId_ReturnsOkWithoutDelete() throws Exception {
        when(commentService.findById(999)).thenReturn(null);

        mockMvc.perform(delete("/comment/delete/999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(commentService, times(1)).findById(999);
        verify(commentService, never()).delete(any());
    }
}
