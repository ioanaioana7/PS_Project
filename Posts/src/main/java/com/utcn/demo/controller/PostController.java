package com.utcn.demo.controller;

import com.utcn.demo.entity.Post;
import com.utcn.demo.service.PostService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/post")
public class PostController {

    @Autowired private PostService postService;

    @GetMapping("/getPosts")
    public List<Post> getPosts() {
        return postService.findAll();
    }

    @GetMapping("/search")
    public List<Post> searchPosts(
            @RequestParam(required = false) Long userID,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String tag) {
        return postService.filterPosts(title, tag, userID);
    }

    @PostMapping("/createPost")
    public Post addPost(@RequestBody Post post) {
        return postService.createPost(post);
    }

    @GetMapping("/{id}")
    public Post getPostByID(@PathVariable int id) {
        return postService.findById(id);
    }

    @PutMapping("/update/{id}")
    public Post updatePost(@PathVariable int id, @RequestBody Post post) {
        return postService.updatePost(post, id);
    }

    @DeleteMapping("/delete/{id}")
    public void deletePost(@PathVariable int id) {
        Post post = postService.findById(id);
        if (post != null) {
            postService.delete(post);
        }
    }
}
