package com.utcn.demo.repository;

import com.utcn.demo.entity.Tag;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepository extends JpaRepository<Tag, Long> {
    Tag findByDescription(String description);
}
