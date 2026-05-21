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
            System.out.println("Error: Post does not exist");
            return null;
        }

        Post post = postRepository.findById(comment.getPost().getId()).orElse(null);

        if (post == null) {
            System.out.println("Error: Post does not exist");
            return null;
        }

        if ("Outdated".equals(post.getStatus())) {
            System.out.println("Comments are closed");
            return null;
        }

        List<Comment> comments = commentRepository.findByPostId(post.getId().intValue());

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
