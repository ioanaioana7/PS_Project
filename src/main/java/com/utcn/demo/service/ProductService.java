package com.utcn.demo.service;

import com.utcn.demo.entity.Product;
import com.utcn.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> findAll() {
        List<Product> products = (List<Product>) productRepository.findAll();
        return products;
    }

    public Product findById(int id) {
//        return productRepository.findById(Long.valueOf(id)).orElse(null););
        Optional<Product> product = productRepository.findById(Long.valueOf(id));
        if(product.isPresent()){
            return product.get();
        }
        return null;
    }

    public Product save(Product product) {
        return productRepository.save(product);
    }

    public void delete(Product product) {
        productRepository.delete(product);
    }
}
