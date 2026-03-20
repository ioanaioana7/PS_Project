package com.utcn.demo.repository;

import com.utcn.demo.entity.Post;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends CrudRepository<Post, Long> {

}
