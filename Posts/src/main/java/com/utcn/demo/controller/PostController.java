package com.utcn.demo.controller;

import com.utcn.demo.entity.Comment;
import com.utcn.demo.entity.Post;
import com.utcn.demo.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/post")
public class PostController {

    @Autowired
    private PostService postService;

    @GetMapping("/getPosts")
    public List<Post> getPosts() {
        return postService.findAll();
    }

    @PostMapping("/createPost")
    public Post addPost(@RequestBody Post post) {
        return postService.save(post);
    }

    @GetMapping("/{id}")
    public Post getPostByID(@PathVariable int id){
        return postService.findById(id);
    }

    @PutMapping("/update/{id}")
    public Post updatePost(@PathVariable int id, @RequestBody Post post){
        Post existingPost = postService.findById(id);
        if(existingPost != null){
            existingPost.setTitle(post.getTitle());
            existingPost.setContent(post.getContent());
            existingPost.setStatus(post.getStatus());
            existingPost.setPicturePath(post.getPicturePath());
            ///NU e adaptat userID no clue daca trebe
            return postService.save(existingPost);
        }
        return null;
    }

    @DeleteMapping("/delete/{id}")
    public void deletePost(@PathVariable int id){
        Post post = postService.findById(id);
        if(post != null){
            postService.delete(post);
        }
    }
}
