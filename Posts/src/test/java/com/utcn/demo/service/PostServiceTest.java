package com.utcn.demo.service;

import com.utcn.demo.entity.Post;
import com.utcn.demo.repository.CommentRepository;
import com.utcn.demo.repository.PostRepository;
import com.utcn.demo.repository.VoteRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock
    private PostRepository postRepository;
    
    @Mock
    private CommentRepository commentRepository;

    @Mock
    private VoteRepository voteRepository;

    @InjectMocks
    private PostService postService;

    @Test
    void findAll_ReturnsPostList() {
        List<Post> posts = new ArrayList<>();
        posts.add(new Post(1L, 100L, "Spring Boot Tips", "Here are some useful Spring Boot tips", LocalDateTime.now(), null, "published", new HashSet<>(), null));
        posts.add(new Post(2L, 101L, "Java Best Practices", "Important Java best practices", LocalDateTime.now(), null, "published", new HashSet<>(), null));

        when(postRepository.findAllByOrderByPostDateDesc()).thenReturn(posts);

        List<Post> result = postService.findAll();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Spring Boot Tips", result.get(0).getTitle());
        verify(postRepository, times(1)).findAllByOrderByPostDateDesc();
    }

    @Test
    void findAll_Empty_ReturnsEmptyList() {
        when(postRepository.findAllByOrderByPostDateDesc()).thenReturn(new ArrayList<>());

        List<Post> result = postService.findAll();

        assertNotNull(result);
        assertEquals(0, result.size());
        verify(postRepository, times(1)).findAllByOrderByPostDateDesc();
    }

    @Test
    void findById_ExistingId_ReturnsPost() {
        Post post = new Post(1L, 100L, "Spring Boot Tips", "Here are some useful Spring Boot tips", LocalDateTime.now(), null, "published", new HashSet<>(), null);
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        Post result = postService.findById(1);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Spring Boot Tips", result.getTitle());
        verify(postRepository, times(1)).findById(1L);
    }

    @Test
    void findById_NonExistingId_ReturnsNull() {
        when(postRepository.findById(999L)).thenReturn(Optional.empty());

        Post result = postService.findById(999);

        assertNull(result);
        verify(postRepository, times(1)).findById(999L);
    }

    @Test
    void save_CallsRepositoryAndReturnsSaved() {
        Post post = new Post(1L, 100L, "Spring Boot Tips", "Here are some useful Spring Boot tips", LocalDateTime.now(), null, "published", new HashSet<>(), null);
        when(postRepository.save(post)).thenReturn(post);

        Post result = postService.save(post);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Spring Boot Tips", result.getTitle());
        verify(postRepository, times(1)).save(post);
    }

    @Test
    void save_NewPost_ReturnsSavedWithId() {
        Post newPost = new Post(null, 102L, "New Post", "New content", LocalDateTime.now(), null, "draft", new HashSet<>(), null);
        Post saved = new Post(50L, 102L, "New Post", "New content", LocalDateTime.now(), null, "draft", new HashSet<>(), null);

        when(postRepository.save(newPost)).thenReturn(saved);

        Post result = postService.save(newPost);

        assertNotNull(result);
        assertEquals(50L, result.getId());
        assertEquals("New Post", result.getTitle());
        verify(postRepository, times(1)).save(newPost);
    }

    @Test
    void delete_CallsRepositoryDelete() {
        Long postId = 1L;
        Post post = new Post(1L, 100L, "Spring Boot Tips", "Here are some useful Spring Boot tips", LocalDateTime.now(), null, "published", new HashSet<>(), null);
        
        when(postRepository.findById(postId)).thenReturn(Optional.of(post));
        
        postService.delete(postId);

        verify(postRepository, times(1)).findById(postId);
        verify(commentRepository, times(1)).deleteAll(anyList());
        verify(postRepository, times(1)).deleteById(postId);
    }
}
