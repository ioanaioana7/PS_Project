package com.utcn.demo.controller;

import com.utcn.demo.entity.Tag;
import com.utcn.demo.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tag")
public class TagController {
    @Autowired
    private TagService tagService;

    @GetMapping("/getTags")
    public List<Tag> getTags() {
        return tagService.findAll();
    }

    @PostMapping("/createTag")
    public Tag addTag(@RequestBody Tag tag) {
        return tagService.save(tag);
    }

    @GetMapping("/{id}")
    public Tag getCommentByID(@PathVariable int id){
        return tagService.findById(id);
    }
}
