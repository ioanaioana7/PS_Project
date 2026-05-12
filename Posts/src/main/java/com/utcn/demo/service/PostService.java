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

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Transactional
@Service
public class PostService {

    @Autowired private PostRepository postRepository;
    @Autowired private TagRepository tagRepository;

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
        return postRepository.save(post);
    }

    public Post updatePost(Post post, int id) {
        Post existingPost = postRepository.findById(Long.valueOf(id)).orElse(null);
        if (existingPost != null) {
            existingPost.setTitle(post.getTitle());
            existingPost.setContent(post.getContent());
            existingPost.setStatus(post.getStatus());
            existingPost.setPicturePath(post.getPicturePath());
            Set<Tag> managedTags = new HashSet<>();
            for (Tag tag : post.getTags()) {
                Tag existingTag = tagRepository.findByDescription(tag.getDescription());
                if (existingTag == null) {
                    existingTag = tagRepository.save(tag);
                }
                managedTags.add(existingTag);
            }
            existingPost.setTags(managedTags);
            return postRepository.save(existingPost);
        }
        return null;
    }

    public void delete(Post post) {
        postRepository.delete(post);
    }
}
