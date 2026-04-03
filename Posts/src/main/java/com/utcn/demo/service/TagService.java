package com.utcn.demo.service;

import com.utcn.demo.entity.Comment;
import com.utcn.demo.entity.Post;
import com.utcn.demo.entity.Tag;
import com.utcn.demo.repository.PostRepository;
import com.utcn.demo.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService {

    @Autowired
    private TagRepository tagRepository;

    public List<Tag> findAll() {
        return (List<Tag>) tagRepository.findAll();
    }
    public Tag findById(int id) {
        return tagRepository.findById(Long.valueOf(id)).orElse(null);
    }
    public Tag save(Tag tag) {
        return tagRepository.save(tag);
    }

}
