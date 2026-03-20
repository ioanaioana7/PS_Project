package com.utcn.demo.service;

import com.utcn.demo.entity.Comment;
import com.utcn.demo.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private PostRepository productRepository;

    public List<Comment> findAll() {
        List<Comment> products = (List<Comment>) productRepository.findAll();
        return products;
    }

    public Comment findById(int id) {
//        return productRepository.findById(Long.valueOf(id)).orElse(null););
        Optional<Comment> product = productRepository.findById(Long.valueOf(id));
        if(product.isPresent()){
            return product.get();
        }
        return null;
    }

    public Comment save(Comment product) {
        return productRepository.save(product);
    }

    public void delete(Comment product) {
        productRepository.delete(product);
    }
}
