package com.utcn.demo.service;

import com.utcn.demo.entity.Comment;
import com.utcn.demo.entity.Post;
import com.utcn.demo.repository.CommentRepository;
import com.utcn.demo.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public List<Comment> findAll() {
        return (List<Comment>) commentRepository.findAll();
    }

    public Comment findById(int id) {
        return commentRepository.findById(Long.valueOf(id)).orElse(null);
    }

    public Comment save(Comment comment) {
        if(comment.getPost()!=null)
            return commentRepository.save(comment);
        System.out.println("Error the post doesnt exist");
        return comment;
    }

    public void delete(Comment comment) {
        commentRepository.delete(comment);
    }
}
