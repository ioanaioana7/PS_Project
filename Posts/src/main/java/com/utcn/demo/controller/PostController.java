package com.utcn.demo.controller;

import com.utcn.demo.entity.Post;
import com.utcn.demo.service.PostService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/post")
public class PostController {

    @Autowired private PostService postService;

    @PostMapping("/uploadImage")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = postService.saveImage(file);
            return ResponseEntity.ok(imageUrl);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to upload image: " + e.getMessage());
        }
    }

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

    //F3
    @PutMapping("/close/{id}")
    public Post closePost(@PathVariable Long id){
        return postService.closePost(id);
    }
}
