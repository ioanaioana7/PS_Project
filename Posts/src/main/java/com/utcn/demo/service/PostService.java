package com.utcn.demo.service;

import com.utcn.demo.entity.Post;
import com.utcn.demo.entity.Tag;
import com.utcn.demo.repository.PostRepository;
import com.utcn.demo.repository.TagRepository;

import jakarta.persistence.criteria.Join;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Transactional
@Service
public class PostService {

    @Autowired private PostRepository postRepository;
    @Autowired private TagRepository tagRepository;

    private final String uploadDir = "uploads"; // Directory to save images

    public PostService() {
        // Ensure upload directory exists
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (Exception e) {
            System.err.println("Could not create upload directory: " + e.getMessage());
        }
    }

    public String saveImage(MultipartFile file) throws Exception {
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String newFilename = UUID.randomUUID().toString() + fileExtension;
        Path filePath = Paths.get(uploadDir + File.separator + newFilename);
        Files.copy(file.getInputStream(), filePath);
        return "/uploads/" + newFilename; // Return URL path
    }

    public List<Post> findAll() {
        return (List<Post>) postRepository.findAllByOrderByPostDateDesc();
    }

    public Post findById(int id) {
        return postRepository.findById(Long.valueOf(id)).orElse(null);
    }

    public List<Post> filterPosts(String title, String tag, Long userID) {
        Specification<Post> spec = Specification.where(null);
        if (title != null && !title.isEmpty()) {
            spec =
                    spec.and(
                            (root, query, criteriaBuilder) ->
                                    criteriaBuilder.like(root.get("title"), "%" + title + "%"));
        }
        if (tag != null && !tag.isEmpty()) {
            spec =
                    spec.and(
                            (root, query, criteriaBuilder) -> {
                                Join<Post, Tag> tags = root.join("tags");
                                return criteriaBuilder.like(
                                        tags.get("description"), "%" + tag + "%");
                            });
        }
        if (userID != null) {
            spec =
                    spec.and(
                            (root, query, criteriaBuilder) ->
                                    criteriaBuilder.equal(root.get("userID"), userID));
        }
        return postRepository.findAll(spec);
    }

    public Post createPost(Post post) {
        Set<Tag> managedTags = new HashSet<>();
        for (Tag tag : post.getTags()) {
            Tag existingTag = tagRepository.findByDescription(tag.getDescription());
            if (existingTag == null) {
                existingTag = tagRepository.save(tag);
            }
            managedTags.add(existingTag);
        }
        post.setTags(managedTags);

        post.setStatus("Just Posted");
        post.setPostDate(LocalDateTime.now());

        return postRepository.save(post);
    }

    public Post save(Post post) {
        return createPost(post);
    }

    public Post updatePost(Post post, int id) {
        Post existingPost = postRepository.findById(Long.valueOf(id)).orElse(null);
        if (existingPost != null) {
            existingPost.setTitle(post.getTitle());
            existingPost.setContent(post.getContent());
            
            // Only update picturePath if a new one is provided
            if (post.getPicturePath() != null && !post.getPicturePath().isEmpty()) {
                existingPost.setPicturePath(post.getPicturePath());
            }

            // Status and tags should be updated carefully, or not at all from frontend form
            // For now, let's assume they might be sent. If not sent, keep existing.
            if (post.getStatus() != null && !post.getStatus().isEmpty()) {
                existingPost.setStatus(post.getStatus());
            }

            Set<Tag> managedTags = new HashSet<>();
            if (post.getTags() != null) {
                for (Tag tag : post.getTags()) {
                    Tag existingTag = tagRepository.findByDescription(tag.getDescription());
                    if (existingTag == null) {
                        existingTag = tagRepository.save(tag);
                    }
                    managedTags.add(existingTag);
                }
                existingPost.setTags(managedTags);
            }
            
            return postRepository.save(existingPost);
        }
        return null;
    }

    public Post closePost(Long id){
        Post post = postRepository.findById(id).orElse(null);
        if(post != null){
            post.setStatus("Outdated");
            return postRepository.save(post);
        }
        return null;
    }
    public void delete(Post post) {
        postRepository.delete(post);
    }
}
