package com.utcn.demo.service;

import com.utcn.demo.entity.Post;
import com.utcn.demo.entity.Tag;
import com.utcn.demo.repository.TagRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TagServiceTest {

    @Mock
    private TagRepository tagRepository;

    @InjectMocks
    private TagService tagService;

    @Test
    void findAll_ReturnsTagList() {
        List<Tag> tags = new ArrayList<>();
        tags.add(new Tag(1L, "java"));
        tags.add(new Tag(2L, "spring"));

        when(tagRepository.findAll()).thenReturn(tags);

        List<Tag> result = tagService.findAll();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("java", result.get(0).getDescription());
        verify(tagRepository, times(1)).findAll();
    }

    @Test
    void findAll_Empty_ReturnsEmptyList() {
        when(tagRepository.findAll()).thenReturn(new ArrayList<>());

        List<Tag> result = tagService.findAll();

        assertNotNull(result);
        assertEquals(0, result.size());
        verify(tagRepository, times(1)).findAll();
    }

    @Test
    void findById_ExistingId_ReturnsTag() {
        Tag tag = new Tag(1L, "java");
        when(tagRepository.findById(1L)).thenReturn(Optional.of(tag));

        Tag result = tagService.findById(1);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("java", result.getDescription());
        verify(tagRepository, times(1)).findById(1L);
    }

    @Test
    void findById_NonExistingId_ReturnsNull() {
        when(tagRepository.findById(999L)).thenReturn(Optional.empty());

        Tag result = tagService.findById(999);

        assertNull(result);
        verify(tagRepository, times(1)).findById(999L);
    }

    @Test
    void save_CallsRepositoryAndReturnsSaved() {
        Tag tag = new Tag(1L, "java");
        when(tagRepository.save(tag)).thenReturn(tag);

        Tag result = tagService.save(tag);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("java", result.getDescription());
        verify(tagRepository, times(1)).save(tag);
    }

    @Test
    void save_NewTag_ReturnsSavedWithId() {
        Tag newTag = new Tag(null, "python");
        Tag saved = new Tag(3L, "python");

        when(tagRepository.save(newTag)).thenReturn(saved);

        Tag result = tagService.save(newTag);

        assertNotNull(result);
        assertEquals(3L, result.getId());
        assertEquals("python", result.getDescription());
        verify(tagRepository, times(1)).save(newTag);
    }
}