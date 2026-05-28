package com.utcn.demo.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.utcn.demo.entity.Comment;
import com.utcn.demo.entity.Post;
import com.utcn.demo.repository.CommentRepository;
import com.utcn.demo.repository.PostRepository;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;
    
    @Mock
    private PostRepository postRepository;

    @InjectMocks
    private CommentService commentService;

    @Test
    void findAll_ReturnsCommentList() {
        List<Comment> comments = new ArrayList<>();
        // Post(id, userID, title, content, postDate, picturePath, status, tags, comments)
        Post post = new Post(1L, 100L, "Test Post", "Test Content", LocalDateTime.now(), null, "published", null, null);
        comments.add(new Comment(1L, (long) 1, "Great post!", null, LocalDateTime.now(), post));
        comments.add(new Comment(2L, (long) 2, "Thanks for sharing", null, LocalDateTime.now(), post));

        when(commentRepository.findAll()).thenReturn(comments);

        List<Comment> result = commentService.findAll();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Great post!", result.get(0).getContent());
        verify(commentRepository, times(1)).findAll();
    }

    @Test
    void findAll_Empty_ReturnsEmptyList() {
        when(commentRepository.findAll()).thenReturn(new ArrayList<>());

        List<Comment> result = commentService.findAll();

        assertNotNull(result);
        assertEquals(0, result.size());
        verify(commentRepository, times(1)).findAll();
    }

    @Test
    void findById_ExistingId_ReturnsComment() {
        Post post = new Post(1L, 100L, "Test Post", "Test Content", LocalDateTime.now(), null, "published", null, null);
        Comment comment = new Comment(1L, (long) 1, "Great post!", null, LocalDateTime.now(), post);
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));

        Comment result = commentService.findById(1);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Great post!", result.getContent());
        verify(commentRepository, times(1)).findById(1L);
    }

    @Test
    void findById_NonExistingId_ReturnsNull() {
        when(commentRepository.findById(999L)).thenReturn(Optional.empty());

        Comment result = commentService.findById(999);

        assertNull(result);
        verify(commentRepository, times(1)).findById(999L);
    }

    @Test
    void save_WithValidPost_ReturnsCommentAndCallsRepository() {
        Post post = new Post(1L, 100L, "Test Post", "Test Content", LocalDateTime.now(), null, "published", null, null);
        Comment comment = new Comment(1L, (long) 1, "Great post!", null, LocalDateTime.now(), post);
        
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        when(commentRepository.findByPostId(1)).thenReturn(new ArrayList<>());
        when(commentRepository.save(comment)).thenReturn(comment);

        Comment result = commentService.save(comment);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Great post!", result.getContent());
        verify(commentRepository, times(1)).save(comment);
    }

    @Test
    void save_WithoutPost_ReturnsCommentWithoutSaving() {
        Comment comment = new Comment(3L, (long) 3, "No post comment", null, LocalDateTime.now(), null);

        assertThrows(IllegalArgumentException.class, () -> commentService.save(comment));
        verify(commentRepository, never()).save(any());
    }

    @Test
    void delete_CallsRepositoryDelete() {
        Post post = new Post(1L, 100L, "Test Post", "Test Content", LocalDateTime.now(), null, "published", null, null);
        Comment comment = new Comment(1L, (long) 1, "Great post!", null, LocalDateTime.now(), post);
        doNothing().when(commentRepository).delete(comment);

        commentService.delete(comment);

        verify(commentRepository, times(1)).delete(comment);
    }
}
