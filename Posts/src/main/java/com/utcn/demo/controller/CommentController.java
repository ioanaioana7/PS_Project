package com.utcn.demo.controller;

import com.utcn.demo.entity.Comment;
import com.utcn.demo.service.CommentService;
import com.utcn.demo.service.PostService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comment")
public class CommentController {
    @Autowired private CommentService commentService;
    @Autowired private PostService postService;

    @GetMapping("/getComments")
    public List<Comment> getComments() {
        return commentService.findAll();
    }

    @PostMapping("/createComment")
    public Comment addComment(@RequestBody Comment comment) {
        return commentService.save(comment);
    }

    @GetMapping("/{id}")
    public List<Comment> getCommentsByPostID(@PathVariable int id) {
        return commentService.findByPostId(id);
    }

    @PutMapping("/update/{id}")
    public Comment updateComment(@PathVariable int id, @RequestBody Comment comment) {
        Comment existingComment = commentService.findById(id);
        if (existingComment != null) {
            existingComment.setContent(comment.getContent());
            existingComment.setPicturePath(comment.getPicturePath());
            return commentService.save(existingComment);
        }
        return null;
    }

    @DeleteMapping("/delete/{id}")
    public void deleteComment(@PathVariable int id) {
        Comment comment = commentService.findById(id);
        if (comment != null) {
            commentService.delete(comment);
        }
    }
}
