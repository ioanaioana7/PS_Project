package com.utcn.demo.service;

import com.utcn.demo.entity.Comment;
import com.utcn.demo.entity.Post;
import com.utcn.demo.repository.CommentRepository;

import com.utcn.demo.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    @Autowired private CommentRepository commentRepository;
    @Autowired private PostRepository postRepository;

    public List<Comment> findAll() {
        return (List<Comment>) commentRepository.findAll();
    }

    public List<Comment> findByPostId(int postId) {
        return commentRepository.findByPostId(postId);
    }

    public Comment findById(int id) {
        return commentRepository.findById(Long.valueOf(id)).orElse(null);
    }

    public Comment save(Comment comment) {
        if (comment.getPost() == null || comment.getPost().getId() == null) {
            throw new IllegalArgumentException("Post does not exist");
        }

        Post post = postRepository.findById(comment.getPost().getId()).orElse(null);

        if (post == null) {
            throw new IllegalArgumentException("Post does not exist");
        }

        // Rule: Outdated -> no more comments can be added
        if ("Outdated".equals(post.getStatus())) {
            throw new IllegalStateException("Comments are closed for this post");
        }

        List<Comment> comments = commentRepository.findByPostId(post.getId().intValue());

        // Rule: First Reactions -> when the first comment was posted
        if (comments.isEmpty()) {
            post.setStatus("First Reactions");
            postRepository.save(post);
        }

        comment.setPost(post);

        return commentRepository.save(comment);
    }

    public void delete(Comment comment) {
        commentRepository.delete(comment);
    }
}
