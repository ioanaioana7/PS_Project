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

    @GetMapping("/getPost")
    public List<Post> getPosts() {
        return postService.findAll();
    }


    @PostMapping("/postPost")
    public Post addPost(@RequestBody Post post) {
        return postService.save(post);
    }
}
