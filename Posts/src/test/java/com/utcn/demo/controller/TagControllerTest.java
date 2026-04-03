package com.utcn.demo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.utcn.demo.entity.Post;
import com.utcn.demo.entity.Tag;
import com.utcn.demo.service.TagService;
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

@WebMvcTest(TagController.class)
class TagControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TagService tagService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getTags_ReturnsTagList() throws Exception {
        Post post = new Post(1L, 100L, "Test Post", "Test Content", LocalDateTime.now(), null, null);
        List<Tag> tags = new ArrayList<>();
        tags.add(new Tag(1L, "java", post));
        tags.add(new Tag(2L, "spring", post));

        when(tagService.findAll()).thenReturn(tags);

        mockMvc.perform(get("/tag/getTags")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].description", is("java")))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].description", is("spring")));

        verify(tagService, times(1)).findAll();
    }

    @Test
    void getTags_Empty_ReturnsEmptyList() throws Exception {
        when(tagService.findAll()).thenReturn(new ArrayList<>());

        mockMvc.perform(get("/tag/getTags")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        verify(tagService, times(1)).findAll();
    }

    @Test
    void createTag_WithValidTag_ReturnsCreatedTag() throws Exception {
        Post post = new Post(1L, 100L, "Test Post", "Test Content", LocalDateTime.now(), null, null);
        Tag tag = new Tag(1L, "java", post);

        when(tagService.save(any())).thenReturn(tag);

        mockMvc.perform(post("/tag/createTag")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(tag)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.description", is("java")));

        verify(tagService, times(1)).save(any());
    }

    @Test
    void getTagById_ExistingId_ReturnsTag() throws Exception {
        Post post = new Post(1L, 100L, "Test Post", "Test Content", LocalDateTime.now(), null, null);
        Tag tag = new Tag(1L, "java", post);

        when(tagService.findById(1)).thenReturn(tag);

        mockMvc.perform(get("/tag/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.description", is("java")));

        verify(tagService, times(1)).findById(1);
    }

    @Test
    void getTagById_NonExistingId_ReturnsNull() throws Exception {
        when(tagService.findById(999)).thenReturn(null);

        mockMvc.perform(get("/tag/999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("null"));

        verify(tagService, times(1)).findById(999);
    }
}
